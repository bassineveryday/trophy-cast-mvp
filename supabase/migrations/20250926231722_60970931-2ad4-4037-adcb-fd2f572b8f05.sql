-- Create comprehensive RBAC system for TrophyCast

-- Create platform roles enum
CREATE TYPE platform_role AS ENUM (
    'super_admin',
    'platform_admin'
);

-- Create club roles enum
CREATE TYPE club_role AS ENUM (
    'club_admin',
    'president', 
    'vice_president',
    'tournament_director',
    'secretary',
    'treasurer',
    'conservation_director',
    'member',
    'guest'
);

-- Create permissions table
CREATE TABLE public.permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    category TEXT NOT NULL, -- 'platform', 'club', 'tournament', 'financial', etc.
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create role_permissions junction table
CREATE TABLE public.role_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform_role platform_role NULL,
    club_role club_role NULL,
    permission_id UUID NOT NULL REFERENCES permissions(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    CONSTRAINT role_permissions_check CHECK (
        (platform_role IS NOT NULL AND club_role IS NULL) OR 
        (platform_role IS NULL AND club_role IS NOT NULL)
    )
);

-- Create user_platform_roles table
CREATE TABLE public.user_platform_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    platform_role platform_role NOT NULL,
    assigned_by UUID,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    UNIQUE(user_id, platform_role)
);

-- Update existing user_roles table to use new club_role enum
ALTER TABLE public.user_roles 
ADD COLUMN club_role club_role DEFAULT 'member',
ADD COLUMN assigned_by UUID,
ADD COLUMN assigned_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
ADD COLUMN expires_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN is_active BOOLEAN DEFAULT true;

-- Create audit log table
CREATE TABLE public.role_audit_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    target_user_id UUID NOT NULL,
    action TEXT NOT NULL, -- 'assigned', 'removed', 'modified'
    role_type TEXT NOT NULL, -- 'platform', 'club'
    old_role TEXT,
    new_role TEXT,
    club_id UUID,
    reason TEXT,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create temporary role elevations table
CREATE TABLE public.temporary_role_elevations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    club_id UUID,
    elevated_to club_role NOT NULL,
    requested_by UUID NOT NULL,
    approved_by UUID,
    reason TEXT NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Insert core permissions
INSERT INTO public.permissions (name, description, category) VALUES
-- Platform permissions
('platform.admin.full', 'Full platform administration', 'platform'),
('platform.support.users', 'User support and assistance', 'platform'),
('platform.view.analytics', 'View platform analytics', 'platform'),

-- Club management permissions
('club.create', 'Create new clubs', 'club'),
('club.admin.full', 'Full club administration', 'club'),
('club.manage.settings', 'Manage club settings', 'club'),
('club.manage.members', 'Manage club membership', 'club'),
('club.assign.roles', 'Assign officer roles', 'club'),
('club.remove.members', 'Remove club members', 'club'),
('club.view.members', 'View club member list', 'club'),
('club.send.communications', 'Send club-wide communications', 'club'),

-- Tournament permissions
('tournament.create', 'Create tournaments', 'tournament'),
('tournament.manage', 'Manage tournament settings', 'tournament'),
('tournament.register.members', 'Register members for tournaments', 'tournament'),
('tournament.record.results', 'Record tournament results', 'tournament'),
('tournament.view.results', 'View tournament results', 'tournament'),

-- Financial permissions
('financial.view.reports', 'View financial reports', 'financial'),
('financial.manage.dues', 'Manage member dues', 'financial'),
('financial.process.payments', 'Process payments', 'financial'),
('financial.manage.budget', 'Manage club budget', 'financial'),

-- Communication permissions
('communication.send.email', 'Send email communications', 'communication'),
('communication.manage.announcements', 'Manage club announcements', 'communication'),
('communication.moderate.discussions', 'Moderate discussions', 'communication'),

-- Conservation permissions
('conservation.manage.projects', 'Manage conservation projects', 'conservation'),
('conservation.submit.reports', 'Submit conservation reports', 'conservation'),
('conservation.organize.events', 'Organize conservation events', 'conservation'),

-- Member permissions
('member.update.profile', 'Update own profile', 'member'),
('member.view.tournaments', 'View tournament information', 'member'),
('member.register.tournaments', 'Register for tournaments', 'member'),
('member.log.catches', 'Log fishing catches', 'member'),

-- Guest permissions
('guest.view.public', 'View public club information', 'guest'),
('guest.request.membership', 'Request club membership', 'guest');

-- Assign permissions to platform roles
INSERT INTO public.role_permissions (platform_role, permission_id)
SELECT 'super_admin', id FROM permissions; -- Super admin gets all permissions

INSERT INTO public.role_permissions (platform_role, permission_id)
SELECT 'platform_admin', id FROM permissions 
WHERE category IN ('platform') AND name IN ('platform.support.users', 'platform.view.analytics');

-- Assign permissions to club roles
-- Club Admin (full club control)
INSERT INTO public.role_permissions (club_role, permission_id)
SELECT 'club_admin', id FROM permissions 
WHERE category IN ('club', 'tournament', 'financial', 'communication', 'conservation', 'member');

-- President (all club functions except platform admin)
INSERT INTO public.role_permissions (club_role, permission_id)
SELECT 'president', id FROM permissions 
WHERE category IN ('club', 'tournament', 'financial', 'communication', 'conservation', 'member');

-- Vice President (backup president access)
INSERT INTO public.role_permissions (club_role, permission_id)
SELECT 'vice_president', id FROM permissions 
WHERE category IN ('club', 'tournament', 'communication', 'member')
AND name NOT IN ('financial.manage.budget', 'financial.process.payments');

-- Tournament Director
INSERT INTO public.role_permissions (club_role, permission_id)
SELECT 'tournament_director', id FROM permissions 
WHERE category IN ('tournament', 'member') OR name IN ('club.view.members');

-- Secretary
INSERT INTO public.role_permissions (club_role, permission_id)
SELECT 'secretary', id FROM permissions 
WHERE category IN ('communication', 'member') OR name IN ('club.view.members', 'club.manage.settings');

-- Treasurer
INSERT INTO public.role_permissions (club_role, permission_id)
SELECT 'treasurer', id FROM permissions 
WHERE category IN ('financial', 'member') OR name IN ('club.view.members');

-- Conservation Director
INSERT INTO public.role_permissions (club_role, permission_id)
SELECT 'conservation_director', id FROM permissions 
WHERE category IN ('conservation', 'member') OR name IN ('club.view.members');

-- Member
INSERT INTO public.role_permissions (club_role, permission_id)
SELECT 'member', id FROM permissions 
WHERE category = 'member';

-- Guest
INSERT INTO public.role_permissions (club_role, permission_id)
SELECT 'guest', id FROM permissions 
WHERE category = 'guest';

-- Enable RLS on all new tables
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_permissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_platform_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.role_audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.temporary_role_elevations ENABLE ROW LEVEL SECURITY;

-- RLS Policies for permissions (read-only for authenticated users)
CREATE POLICY "Anyone can view permissions" ON public.permissions FOR SELECT USING (true);

CREATE POLICY "Anyone can view role permissions" ON public.role_permissions FOR SELECT USING (true);

-- RLS Policies for user_platform_roles
CREATE POLICY "Platform admins can manage platform roles" ON public.user_platform_roles
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM user_platform_roles upr 
        WHERE upr.user_id = auth.uid() 
        AND upr.platform_role = 'super_admin' 
        AND upr.is_active = true
    )
);

CREATE POLICY "Users can view their own platform roles" ON public.user_platform_roles
FOR SELECT USING (user_id = auth.uid());

-- RLS Policies for audit log
CREATE POLICY "Platform admins can view audit logs" ON public.role_audit_log
FOR SELECT USING (
    EXISTS (
        SELECT 1 FROM user_platform_roles upr 
        WHERE upr.user_id = auth.uid() 
        AND upr.platform_role IN ('super_admin', 'platform_admin')
        AND upr.is_active = true
    )
);

CREATE POLICY "Club officers can view club audit logs" ON public.role_audit_log
FOR SELECT USING (
    club_id IN (
        SELECT ur.club_id FROM user_roles ur 
        WHERE ur.user_id = auth.uid() 
        AND ur.club_role IN ('club_admin', 'president', 'vice_president')
        AND ur.is_active = true
    )
);

-- RLS Policies for temporary elevations
CREATE POLICY "Club officers can manage elevations" ON public.temporary_role_elevations
FOR ALL USING (
    club_id IN (
        SELECT ur.club_id FROM user_roles ur 
        WHERE ur.user_id = auth.uid() 
        AND ur.club_role IN ('club_admin', 'president')
        AND ur.is_active = true
    )
);

-- Create function to check user permissions
CREATE OR REPLACE FUNCTION public.user_has_permission(
    _user_id UUID,
    _permission_name TEXT,
    _club_id UUID DEFAULT NULL
) RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    -- Check platform role permissions
    SELECT EXISTS (
        SELECT 1 
        FROM user_platform_roles upr
        JOIN role_permissions rp ON rp.platform_role = upr.platform_role
        JOIN permissions p ON p.id = rp.permission_id
        WHERE upr.user_id = _user_id 
        AND upr.is_active = true
        AND (upr.expires_at IS NULL OR upr.expires_at > NOW())
        AND p.name = _permission_name
    )
    OR
    -- Check club role permissions
    EXISTS (
        SELECT 1 
        FROM user_roles ur
        JOIN role_permissions rp ON rp.club_role = ur.club_role
        JOIN permissions p ON p.id = rp.permission_id
        WHERE ur.user_id = _user_id 
        AND ur.is_active = true
        AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
        AND (_club_id IS NULL OR ur.club_id = _club_id)
        AND p.name = _permission_name
    )
    OR
    -- Check temporary elevations
    EXISTS (
        SELECT 1 
        FROM temporary_role_elevations tre
        JOIN role_permissions rp ON rp.club_role = tre.elevated_to
        JOIN permissions p ON p.id = rp.permission_id
        WHERE tre.user_id = _user_id 
        AND tre.is_active = true
        AND tre.expires_at > NOW()
        AND (_club_id IS NULL OR tre.club_id = _club_id)
        AND p.name = _permission_name
    )
$$;

-- Create function to get user's effective roles
CREATE OR REPLACE FUNCTION public.get_user_effective_roles(
    _user_id UUID,
    _club_id UUID DEFAULT NULL
) RETURNS TABLE (
    role_type TEXT,
    role_name TEXT,
    club_id UUID,
    expires_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    -- Platform roles
    SELECT 
        'platform' as role_type,
        upr.platform_role::TEXT as role_name,
        NULL::UUID as club_id,
        upr.expires_at
    FROM user_platform_roles upr
    WHERE upr.user_id = _user_id 
    AND upr.is_active = true
    AND (upr.expires_at IS NULL OR upr.expires_at > NOW())
    
    UNION ALL
    
    -- Club roles
    SELECT 
        'club' as role_type,
        ur.club_role::TEXT as role_name,
        ur.club_id,
        ur.expires_at
    FROM user_roles ur
    WHERE ur.user_id = _user_id 
    AND ur.is_active = true
    AND (ur.expires_at IS NULL OR ur.expires_at > NOW())
    AND (_club_id IS NULL OR ur.club_id = _club_id)
    
    UNION ALL
    
    -- Temporary elevations
    SELECT 
        'temporary' as role_type,
        tre.elevated_to::TEXT as role_name,
        tre.club_id,
        tre.expires_at
    FROM temporary_role_elevations tre
    WHERE tre.user_id = _user_id 
    AND tre.is_active = true
    AND tre.expires_at > NOW()
    AND (_club_id IS NULL OR tre.club_id = _club_id)
$$;

-- Create indexes for performance
CREATE INDEX idx_user_platform_roles_user_id ON user_platform_roles(user_id);
CREATE INDEX idx_user_platform_roles_active ON user_platform_roles(is_active, expires_at);
CREATE INDEX idx_role_permissions_platform_role ON role_permissions(platform_role);
CREATE INDEX idx_role_permissions_club_role ON role_permissions(club_role);
CREATE INDEX idx_role_audit_log_user_id ON role_audit_log(user_id);
CREATE INDEX idx_role_audit_log_target_user_id ON role_audit_log(target_user_id);
CREATE INDEX idx_role_audit_log_created_at ON role_audit_log(created_at);
CREATE INDEX idx_temporary_elevations_user_id ON temporary_role_elevations(user_id);
CREATE INDEX idx_temporary_elevations_expires ON temporary_role_elevations(expires_at, is_active);

-- Migrate existing user_roles data to new club_role column
UPDATE user_roles SET 
    club_role = CASE 
        WHEN role = 'admin' THEN 'club_admin'::club_role
        WHEN role = 'club_officer' THEN 'president'::club_role
        ELSE 'member'::club_role
    END
WHERE club_role IS NULL;
-- Create storage bucket for member import files
INSERT INTO storage.buckets (id, name, public) VALUES ('member-imports', 'member-imports', false);

-- Create member import audit table
CREATE TABLE public.member_import_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    club_id UUID NOT NULL,
    imported_by UUID NOT NULL,
    file_name TEXT NOT NULL,
    file_size INTEGER,
    total_rows INTEGER,
    successful_imports INTEGER,
    failed_imports INTEGER,
    errors JSONB,
    import_data JSONB,
    status TEXT NOT NULL DEFAULT 'processing', -- 'processing', 'completed', 'failed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE
);

-- Create temporary member staging table for import processing
CREATE TABLE public.member_import_staging (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    import_log_id UUID NOT NULL REFERENCES member_import_logs(id) ON DELETE CASCADE,
    row_number INTEGER NOT NULL,
    name TEXT,
    email TEXT,
    phone TEXT,
    home_state TEXT,
    city TEXT,
    club_role TEXT DEFAULT 'member',
    signature_techniques TEXT[],
    emergency_contact TEXT,
    boat_registration TEXT,
    validation_errors JSONB,
    is_valid BOOLEAN DEFAULT false,
    is_duplicate BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.member_import_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_import_staging ENABLE ROW LEVEL SECURITY;

-- RLS policies for import logs
CREATE POLICY "Club officers can manage import logs" ON public.member_import_logs
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM user_roles ur 
        WHERE ur.user_id = auth.uid() 
        AND ur.club_id = member_import_logs.club_id
        AND ur.club_role IN ('club_admin', 'president', 'vice_president', 'secretary')
        AND ur.is_active = true
    )
);

-- RLS policies for staging table
CREATE POLICY "Club officers can manage staging data" ON public.member_import_staging
FOR ALL USING (
    EXISTS (
        SELECT 1 FROM member_import_logs mil
        JOIN user_roles ur ON ur.club_id = mil.club_id
        WHERE mil.id = member_import_staging.import_log_id
        AND ur.user_id = auth.uid() 
        AND ur.club_role IN ('club_admin', 'president', 'vice_president', 'secretary')
        AND ur.is_active = true
    )
);

-- Storage policies for member import files
CREATE POLICY "Club officers can upload import files" ON storage.objects
FOR INSERT WITH CHECK (
    bucket_id = 'member-imports' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Club officers can view their import files" ON storage.objects
FOR SELECT USING (
    bucket_id = 'member-imports' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Club officers can delete their import files" ON storage.objects
FOR DELETE USING (
    bucket_id = 'member-imports' AND
    auth.uid()::text = (storage.foldername(name))[1]
);

-- Function to validate email format
CREATE OR REPLACE FUNCTION public.is_valid_email(email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$';
END;
$$;

-- Function to check for duplicate emails
CREATE OR REPLACE FUNCTION public.check_duplicate_email(email TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM auth.users WHERE auth.users.email = check_duplicate_email.email
    );
END;
$$;

-- Create indexes for performance
CREATE INDEX idx_member_import_logs_club_id ON member_import_logs(club_id);
CREATE INDEX idx_member_import_logs_imported_by ON member_import_logs(imported_by);
CREATE INDEX idx_member_import_logs_created_at ON member_import_logs(created_at);
CREATE INDEX idx_member_import_staging_import_log_id ON member_import_staging(import_log_id);
CREATE INDEX idx_member_import_staging_email ON member_import_staging(email);
CREATE INDEX idx_member_import_staging_is_valid ON member_import_staging(is_valid);
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Crown, 
  UserCheck, 
  FileText, 
  DollarSign, 
  Trophy, 
  Leaf,
  Clock,
  Users,
  Download,
  Printer,
  Mail
} from "lucide-react";
import { officerRoles, type OfficerRole } from '@/data/officerRoles';

const roleIcons = {
  crown: Crown,
  'user-check': UserCheck,
  'file-text': FileText,
  'dollar-sign': DollarSign,
  trophy: Trophy,
  leaf: Leaf
};

const OfficerRoleLibrary = () => {
  const [selectedRole, setSelectedRole] = useState<OfficerRole | null>(null);

  const handleRoleSelect = (role: OfficerRole) => {
    setSelectedRole(role);
  };

  const handlePrintRole = (role: OfficerRole) => {
    // Create printable content
    const printContent = `
      <div style="padding: 20px; font-family: Arial, sans-serif;">
        <h1>${role.title} - Job Description</h1>
        <p><strong>Description:</strong> ${role.description}</p>
        <h3>Key Responsibilities:</h3>
        <ul>
          ${role.responsibilities.map(resp => `<li>${resp}</li>`).join('')}
        </ul>
        <h3>Required Skills:</h3>
        <ul>
          ${role.skills.map(skill => `<li>${skill}</li>`).join('')}
        </ul>
        <p><strong>Time Commitment:</strong> ${role.timeCommitment}</p>
      </div>
    `;
    
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const generateRecruitmentEmail = (role: OfficerRole) => {
    const subject = `${role.title} Position Available - Join Our Club Leadership`;
    const body = `Hi [Name],

I hope this message finds you well! Our club is looking for someone to fill the ${role.title} position, and I think you'd be perfect for the role.

About the Position:
${role.description}

Time Commitment: ${role.timeCommitment}

Key responsibilities would include:
${role.responsibilities.slice(0, 3).map(resp => `• ${resp}`).join('\n')}

We believe your skills in ${role.skills.join(', ')} would make you an excellent fit for this role.

Would you be interested in learning more? I'd be happy to discuss the position in more detail.

Best regards,
[Your Name]
[Your Title]`;

    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoLink;
  };

  if (selectedRole) {
    const IconComponent = roleIcons[selectedRole.icon as keyof typeof roleIcons];
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={() => setSelectedRole(null)}>
            ← Back to All Roles
          </Button>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handlePrintRole(selectedRole)}
            >
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => generateRecruitmentEmail(selectedRole)}
            >
              <Mail className="w-4 h-4 mr-2" />
              Email Template
            </Button>
          </div>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-full">
                <IconComponent className="w-8 h-8 text-primary" />
              </div>
              <div>
                <CardTitle className="text-2xl">{selectedRole.title}</CardTitle>
                <p className="text-muted-foreground">{selectedRole.description}</p>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <Users className="w-4 h-4 mr-2" />
                  Required Skills
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedRole.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary">{skill}</Badge>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <Clock className="w-4 h-4 mr-2" />
                  Time Commitment
                </h3>
                <Badge variant="outline" className="text-sm">
                  {selectedRole.timeCommitment}
                </Badge>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-4">Key Responsibilities</h3>
              <div className="space-y-3">
                {selectedRole.responsibilities.map((responsibility, index) => (
                  <div key={index} className="p-3 bg-accent rounded-lg">
                    <p className="text-sm">{responsibility}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Perfect for members who:</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Are committed to the club's success and growth</li>
                <li>• Have strong {selectedRole.skills.join(' and ').toLowerCase()} skills</li>
                <li>• Can dedicate {selectedRole.timeCommitment.toLowerCase()} to club activities</li>
                <li>• Want to make a meaningful impact on the fishing community</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Officer Role Library</h2>
        <p className="text-muted-foreground">
          Comprehensive job descriptions for all fishing club officer positions
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {officerRoles.map((role) => {
          const IconComponent = roleIcons[role.icon as keyof typeof roleIcons];
          
          return (
            <Card 
              key={role.id} 
              className="hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => handleRoleSelect(role)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-full">
                    <IconComponent className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">{role.title}</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                  {role.description}
                </p>
                
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-muted-foreground mb-1">Key Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {role.skills.slice(0, 2).map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {role.skills.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{role.skills.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span className="flex items-center">
                      <Clock className="w-3 h-3 mr-1" />
                      {role.timeCommitment}
                    </span>
                    <span>{role.responsibilities.length} duties</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How to Use This Library</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Review Job Descriptions</h3>
              <p className="text-sm text-muted-foreground">
                Click any role to see detailed responsibilities and requirements
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Printer className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Print Reference Cards</h3>
              <p className="text-sm text-muted-foreground">
                Generate printable job descriptions for officer reference
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Mail className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Recruitment Templates</h3>
              <p className="text-sm text-muted-foreground">
                Use email templates to recruit members for specific roles
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OfficerRoleLibrary;
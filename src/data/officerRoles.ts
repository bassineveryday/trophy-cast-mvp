export interface OfficerRole {
  id: string;
  title: string;
  description: string;
  responsibilities: string[];
  skills: string[];
  timeCommitment: string;
  icon: string;
}

export const officerRoles: OfficerRole[] = [
  {
    id: 'president',
    title: 'President',
    description: 'The chief executive officer of the club, responsible for overall leadership and strategic direction.',
    responsibilities: [
      'Meeting Leadership: Presides over meetings, sets agendas, calls special meetings',
      'Club Representation: Represents club at federation events, community meetings',
      'Officer Oversight: Supervises all officers, ensures duties are performed',
      'Strategic Direction: Sets club goals, appoints committees, long-term planning',
      'Social Media: Monitors club Facebook and social media presence',
      'Conflict Resolution: Mediates member disputes, handles disciplinary issues'
    ],
    skills: ['Leadership', 'Communication', 'Organization', 'Conflict Resolution'],
    timeCommitment: '10-15 hours per month',
    icon: 'crown'
  },
  {
    id: 'vice-president',
    title: 'Vice President',
    description: 'Second in command, ready to step into presidential duties when needed.',
    responsibilities: [
      'Presidential Backup: Assumes all presidential duties when president absent',
      'Program Management: Organizes educational/training programs for members',
      'Communication: Assists with social media and member communications',
      'Personnel Issues: Works with president on officer and member concerns',
      'Succession Planning: Ready to assume presidency if position becomes vacant'
    ],
    skills: ['Leadership', 'Program Management', 'Communication', 'Flexibility'],
    timeCommitment: '6-10 hours per month',
    icon: 'user-check'
  },
  {
    id: 'secretary',
    title: 'Secretary',
    description: 'Maintains all club records, communications, and documentation.',
    responsibilities: [
      'Meeting Minutes: Records and maintains accurate minutes of all meetings',
      'Membership Management: Maintains current roster, tracks meeting attendance',
      'Tournament Records: Keeps tournament results, point standings, fish-off eligibility',
      'Correspondence: Handles club correspondence, sends newsletters',
      'Documentation: Maintains club bylaws, rules, information packages'
    ],
    skills: ['Organization', 'Written Communication', 'Attention to Detail', 'Record Keeping'],
    timeCommitment: '8-12 hours per month',
    icon: 'file-text'
  },
  {
    id: 'treasurer',
    title: 'Treasurer',
    description: 'Manages all financial aspects of the club with accuracy and transparency.',
    responsibilities: [
      'Financial Management: Collects/disburses funds, manages bank accounts',
      'Record Keeping: Maintains accurate financial records and transactions',
      'Monthly Reporting: Reports balances, income, expenditures at meetings',
      'Budget Planning: Creates annual budgets, manages fundraising efforts',
      'Bill Payment: Pays authorized expenses, manages vendor relationships',
      'Annual Reports: Prepares detailed financial statements for annual meeting'
    ],
    skills: ['Financial Management', 'Attention to Detail', 'Organization', 'Trustworthiness'],
    timeCommitment: '6-10 hours per month',
    icon: 'dollar-sign'
  },
  {
    id: 'tournament-director',
    title: 'Tournament Director',
    description: 'Oversees all tournament operations from planning to execution.',
    responsibilities: [
      'Schedule Management: Develops annual tournament schedule',
      'Tournament Operations: Organizes pairings, assigns lakes, conducts weigh-ins',
      'Registration: Receives entries, collects fees, manages guest waivers',
      'Rules Enforcement: Conducts tournaments per rules, handles disputes',
      'Results Management: Records results, maintains points, organizes fish-offs',
      'Logistics: Coordinates permits, lake authorities, manages equipment'
    ],
    skills: ['Event Management', 'Organization', 'Rules Knowledge', 'Problem Solving'],
    timeCommitment: '15-25 hours per month',
    icon: 'trophy'
  },
  {
    id: 'conservation-director',
    title: 'Conservation Director',
    description: 'Promotes environmental stewardship and conservation efforts.',
    responsibilities: [
      'Environmental Advocacy: Attends conservation meetings affecting fishing',
      'Fish Care Education: Promotes proper fish handling, educates members',
      'Habitat Projects: Organizes structure building, stocking, cleanup events',
      'Agency Relations: Works with fisheries departments, environmental agencies',
      'Reporting: Documents projects, submits reports to state/national organizations',
      'Grant Management: Identifies funding, submits conservation project proposals'
    ],
    skills: ['Environmental Knowledge', 'Project Management', 'Public Speaking', 'Grant Writing'],
    timeCommitment: '8-15 hours per month',
    icon: 'leaf'
  }
];

export const bestPractices = {
  recruitment: [
    'Start recruiting officers 3-4 months before elections',
    'Look for members who are already engaged and helpful',
    'Consider term limits to encourage fresh perspectives',
    'Provide clear job descriptions before asking for commitments',
    'Offer mentorship and training for new officers'
  ],
  transition: [
    'Schedule transition meetings between outgoing and incoming officers',
    'Create detailed handover documents for each position',
    'Ensure access to all digital accounts and passwords is transferred',
    'Review ongoing projects and commitments',
    'Introduce new officers to key contacts and vendors'
  ],
  training: [
    'Provide orientation sessions for new officers',
    'Share templates and resources from previous years',
    'Connect officers with experienced mentors from other clubs',
    'Attend federation training workshops when available',
    'Schedule quarterly officer development meetings'
  ],
  problemSolving: [
    'Address conflicts early before they escalate',
    'Use written communication for important decisions',
    'Seek guidance from federation officers when needed',
    'Document all major decisions and their rationale',
    'Have backup plans for key events and activities'
  ]
};

export const seasonalResponsibilities = {
  winter: {
    president: ['Plan annual meeting', 'Review club constitution', 'Set goals for upcoming year'],
    treasurer: ['Prepare annual financial report', 'File required tax documents', 'Create next year budget'],
    secretary: ['Archive previous year records', 'Update membership database', 'Prepare annual report'],
    tournamentDirector: ['Plan tournament schedule', 'Secure lake permits', 'Book facilities'],
    conservationDirector: ['Plan habitat projects', 'Apply for grants', 'Schedule cleanup events']
  },
  spring: {
    president: ['Conduct officer elections', 'Welcome new members', 'Kick off tournament season'],
    treasurer: ['Collect tournament fees', 'Pay insurance premiums', 'Track registration income'],
    secretary: ['Distribute tournament schedules', 'Update contact information', 'Process new memberships'],
    tournamentDirector: ['Conduct pre-season meeting', 'Inspect equipment', 'Confirm lake access'],
    conservationDirector: ['Execute habitat projects', 'Organize Earth Day activities', 'Monitor fish populations']
  },
  summer: {
    president: ['Monitor tournament attendance', 'Plan member appreciation events', 'Address mid-season issues'],
    treasurer: ['Track tournament expenses', 'Manage prize money', 'Monitor cash flow'],
    secretary: ['Maintain tournament records', 'Track attendance', 'Update point standings'],
    tournamentDirector: ['Run tournaments', 'Handle rule disputes', 'Manage equipment'],
    conservationDirector: ['Monitor water conditions', 'Educate on fish care', 'Organize structure builds']
  },
  fall: {
    president: ['Plan annual banquet', 'Recruit new officers', 'Evaluate year performance'],
    treasurer: ['Calculate final standings', 'Prepare banquet budget', 'Order awards'],
    secretary: ['Compile annual statistics', 'Prepare award information', 'Plan officer transitions'],
    tournamentDirector: ['Organize championships', 'Maintain equipment', 'Plan next year improvements'],
    conservationDirector: ['Submit annual reports', 'Plan winter projects', 'Evaluate conservation impact']
  }
};
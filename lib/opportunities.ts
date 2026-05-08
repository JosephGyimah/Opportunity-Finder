export type OpportunityType = 'internship' | 'scholarship' | 'job' | 'fellowship' | 'grant';

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  description: string;
  location: string;
  type: OpportunityType;
  deadline: string;
  tags: string[];
  url: string;
  stipend?: string;
  eligibility: string;
  logo?: string;
}

export const opportunities: Opportunity[] = [
  {
    id: 'opp-001',
    title: 'Google Summer of Code 2025',
    organization: 'Google',
    description: 'A global program focused on bringing more student developers into open source software development. Students work on a 3-month programming project with an open source organization during their break from school.',
    location: 'Remote',
    type: 'internship',
    deadline: '2025-04-02',
    tags: ['Software Engineering', 'Open Source', 'Computer Science'],
    url: 'https://summerofcode.withgoogle.com/',
    stipend: '$1,500 - $6,600',
    eligibility: 'Students 18+ enrolled in post-secondary education',
    logo: 'https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop',
  },
  {
    id: 'opp-002',
    title: 'MasterCard Foundation Scholars Program',
    organization: 'MasterCard Foundation',
    description: 'Provides transformative scholarships to young people from Africa with the potential to lead. Scholars receive comprehensive support including tuition, living expenses, mentorship, and leadership development.',
    location: 'Various Universities',
    type: 'scholarship',
    deadline: '2025-03-15',
    tags: ['Leadership', 'Africa', 'Undergraduate', 'Graduate'],
    url: 'https://mastercardfdn.org/all/scholars/',
    stipend: 'Full Scholarship',
    eligibility: 'African students with demonstrated leadership and financial need',
    logo: 'https://images.pexels.com/photos/3184405/pexels-photo-3184405.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop',
  },
  {
    id: 'opp-003',
    title: 'Microsoft Explore Program',
    organization: 'Microsoft',
    description: 'A 12-week summer internship program specifically designed for college freshmen and sophomores. Interns rotate through software engineering and product management roles to explore different career paths.',
    location: 'Redmond, WA (Hybrid)',
    type: 'internship',
    deadline: '2025-09-01',
    tags: ['Software Engineering', 'Product Management', 'Technology'],
    url: 'https://careers.microsoft.com/',
    stipend: '$6,000/month',
    eligibility: 'Freshmen or sophomores pursuing CS or related degree',
    logo: 'https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop',
  },
  {
    id: 'opp-004',
    title: 'African Development Bank Internship',
    organization: 'African Development Bank',
    description: 'The AfDB internship program offers young graduates the opportunity to work in a professional environment and contribute to the Bank\'s development mission while gaining practical work experience.',
    location: 'Abidjan, Ivory Coast',
    type: 'internship',
    deadline: '2025-02-28',
    tags: ['Finance', 'Development', 'Economics', 'Africa'],
    url: 'https://www.afdb.org/en/careers',
    stipend: '$1,000/month',
    eligibility: 'Graduate students or recent graduates in economics, finance, or related fields',
    logo: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop',
  },
  {
    id: 'opp-005',
    title: 'Chevening Scholarships',
    organization: 'UK Government',
    description: 'Chevening is the UK government\'s international awards scheme aimed at developing global leaders. Scholarships support study at any eligible UK university.',
    location: 'United Kingdom',
    type: 'scholarship',
    deadline: '2024-11-05',
    tags: ['Leadership', 'Graduate Studies', 'UK', 'Masters'],
    url: 'https://www.chevening.org/',
    stipend: 'Full scholarship + living allowance',
    eligibility: 'Citizens of eligible countries with leadership potential and 2+ years work experience',
    logo: 'https://images.pexels.com/photos/1181622/pexels-photo-1181622.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop',
  },
  {
    id: 'opp-006',
    title: 'Meta Software Engineering Internship',
    organization: 'Meta',
    description: 'Join Meta\'s internship program and work on real products used by billions of people. Interns solve complex technical challenges and collaborate with some of the best engineers in the industry.',
    location: 'Menlo Park, CA / Remote',
    type: 'internship',
    deadline: '2025-08-15',
    tags: ['Software Engineering', 'Machine Learning', 'Infrastructure'],
    url: 'https://www.metacareers.com/',
    stipend: '$8,000/month',
    eligibility: 'Currently enrolled in BS/MS/PhD in CS or related field',
    logo: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop',
  },
  {
    id: 'opp-007',
    title: 'Tony Elumelu Foundation Entrepreneurship Program',
    organization: 'Tony Elumelu Foundation',
    description: 'A flagship entrepreneurship program offering $5,000 seed funding, 12-week training, mentoring, and networking to 1,000 African entrepreneurs annually.',
    location: 'Pan-African (Remote)',
    type: 'grant',
    deadline: '2025-06-01',
    tags: ['Entrepreneurship', 'Business', 'Africa', 'Startup'],
    url: 'https://www.tonyelumelufoundation.org/programmes',
    stipend: '$5,000 seed capital',
    eligibility: 'African entrepreneurs with early-stage business idea or existing business under 3 years',
    logo: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop',
  },
  {
    id: 'opp-008',
    title: 'UN Young Professionals Programme',
    organization: 'United Nations',
    description: 'Competitive examination for recruitment of entry-level professionals to the UN Secretariat. Offers opportunity to work on global issues including sustainable development, peace, and human rights.',
    location: 'Various UN Duty Stations',
    type: 'job',
    deadline: '2025-05-31',
    tags: ['International Relations', 'Policy', 'Development', 'Law'],
    url: 'https://careers.un.org/',
    stipend: 'Competitive UN salary',
    eligibility: 'Citizens of underrepresented member states, age 32 or under, Masters degree',
    logo: 'https://images.pexels.com/photos/1056553/pexels-photo-1056553.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop',
  },
  {
    id: 'opp-009',
    title: 'Aga Khan Foundation International Scholarship',
    organization: 'Aga Khan Foundation',
    description: 'Provides scholarships for postgraduate studies to outstanding students from developing countries who have no other means of financing their studies.',
    location: 'Various Countries',
    type: 'scholarship',
    deadline: '2025-03-31',
    tags: ['Graduate Studies', 'Developing Countries', 'Postgraduate'],
    url: 'https://www.akdn.org/akf',
    stipend: 'Half grant, half loan',
    eligibility: 'Students from developing countries pursuing Masters degree',
    logo: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop',
  },
  {
    id: 'opp-010',
    title: 'IBM Research Africa Internship',
    organization: 'IBM Research',
    description: 'Work alongside world-class researchers at IBM Research Africa to solve real-world problems using AI, data science, and cloud computing in the African context.',
    location: 'Nairobi, Kenya / Johannesburg, South Africa',
    type: 'internship',
    deadline: '2025-07-15',
    tags: ['AI', 'Research', 'Data Science', 'Cloud Computing', 'Africa'],
    url: 'https://research.ibm.com/labs/africa',
    stipend: 'Competitive stipend',
    eligibility: 'Graduate students in CS, Engineering, or related quantitative fields',
    logo: 'https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop',
  },
  {
    id: 'opp-011',
    title: 'Yali Network Civic Leadership Program',
    organization: "Obama Foundation / USAID",
    description: 'The Young African Leaders Initiative (YALI) Network offers online courses and in-person trainings to help African leaders advance their careers and strengthen their communities.',
    location: 'Pan-African',
    type: 'fellowship',
    deadline: '2025-08-01',
    tags: ['Leadership', 'Africa', 'Civic Engagement', 'Community Development'],
    url: 'https://yali.state.gov/',
    stipend: 'Travel grant included',
    eligibility: 'African leaders aged 18-35 with community engagement experience',
    logo: 'https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop',
  },
  {
    id: 'opp-012',
    title: 'Andela Software Engineer',
    organization: 'Andela',
    description: 'Andela connects skilled software engineers in Africa with global technology companies. Join the network and access remote opportunities with top companies worldwide.',
    location: 'Remote (Africa-based)',
    type: 'job',
    deadline: 'Rolling',
    tags: ['Software Engineering', 'Remote Work', 'Africa', 'Full Stack'],
    url: 'https://andela.com/',
    stipend: 'Market rate salary',
    eligibility: 'Mid to senior level software engineers with 2+ years experience',
    logo: 'https://images.pexels.com/photos/574071/pexels-photo-574071.jpeg?auto=compress&cs=tinysrgb&w=80&h=80&fit=crop',
  },
];

export const getOpportunityById = (id: string): Opportunity | undefined => {
  return opportunities.find((opp) => opp.id === id);
};

export const typeColors: Record<OpportunityType, string> = {
  internship: 'bg-blue-100 text-blue-700',
  scholarship: 'bg-emerald-100 text-emerald-700',
  job: 'bg-orange-100 text-orange-700',
  fellowship: 'bg-cyan-100 text-cyan-700',
  grant: 'bg-rose-100 text-rose-700',
};

export const typeLabels: Record<OpportunityType, string> = {
  internship: 'Internship',
  scholarship: 'Scholarship',
  job: 'Job',
  fellowship: 'Fellowship',
  grant: 'Grant',
};

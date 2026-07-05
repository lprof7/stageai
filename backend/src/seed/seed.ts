import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { hashPassword } from '../services/authService';
import Student from '../models/Student';
import Company from '../models/Company';
import Cv from '../models/Cv';
import Offer from '../models/Offer';
import Application from '../models/Application';

const ADMIN_PASSWORD = 'admin123';

async function seed() {
  await connectDB();
  console.log('Wiping existing data...');
  await Promise.all([
    Student.deleteMany({}),
    Company.deleteMany({}),
    Cv.deleteMany({}),
    Offer.deleteMany({}),
    Application.deleteMany({}),
  ]);

  // 1. Admin
  const adminHash = await hashPassword(ADMIN_PASSWORD);
  const admin = await Student.create({
    fullName: 'Admin StageAI',
    email: 'admin@stageai.dz',
    passwordHash: adminHash,
    onboardingMethod: 'manual',
    role: 'admin',
  });
  console.log(`Admin created: admin@stageai.dz / ${ADMIN_PASSWORD}`);

  // 2. Students
  const studentData = [
    { fullName: 'Yasmine Belkacem', email: 'yasmine.belkacem@example.dz', education: 'USTHB Alger - Informatique', location: 'Alger' },
    { fullName: 'Omar Cherif', email: 'omar.cherif@example.dz', education: 'ESI Alger - Ingénierie Logicielle', location: 'Alger' },
    { fullName: 'Imene Boudiaf', email: 'imene.boudiaf@example.dz', education: 'ENSIA - Intelligence Artificielle', location: 'Alger' },
    { fullName: 'Riadh Mansouri', email: 'riadh.mansouri@example.dz', education: 'Université Badji Mokhtar Annaba - Informatique', location: 'Annaba' },
    { fullName: 'Sofia Hadj', email: 'sofia.hadj@example.dz', education: 'Université 8 Mai 1945 Guelma - Génie Logiciel', location: 'Guelma' },
    { fullName: 'Aymen Bouaziz', email: 'aymen.bouaziz@example.dz', education: 'Université Constantine 2 - Systèmes d\'Information', location: 'Constantine' },
    { fullName: 'Nesrine Khelifi', email: 'nesrine.khelifi@example.dz', education: 'USTHB Alger - Marketing Digital', location: 'Alger' },
    { fullName: 'Mehdi Toumi', email: 'mehdi.toumi@example.dz', education: 'Université de Sétif 1 - Finance', location: 'Sétif' },
    { fullName: 'Lina Benali', email: 'lina.benali@example.dz', education: 'ESI Alger - Data Science', location: 'Alger' },
    { fullName: 'Karim Djebali', email: 'karim.djebali@example.dz', education: 'USTHB Alger - Electronique', location: 'Alger' },
    { fullName: 'Marwa Hamdi', email: 'marwa.hamdi@example.dz', education: 'Université de Tlemcen - Design Graphique', location: 'Tlemcen' },
    { fullName: 'Yacine Merabet', email: 'yacine.merabet@example.dz', education: 'Université de Béjaïa - Informatique', location: 'Béjaïa' },
    { fullName: 'Amira Saidi', email: 'amira.saidi@example.dz', education: 'ENSIA - Cybersécurité', location: 'Alger' },
    { fullName: 'Houssem Eddine', email: 'houssem.eddine@example.dz', education: 'ESI Alger - Cloud Computing', location: 'Alger' },
    { fullName: 'Chahinez Bensalem', email: 'chahinez.bensalem@example.dz', education: 'Université d\'Oran 1 - Comptabilité', location: 'Oran' },
    { fullName: 'Ilyes Rouane', email: 'ilyes.rouane@example.dz', education: 'USTHB Alger - Mobile Development', location: 'Alger' },
    { fullName: 'Rania Mokhtar', email: 'rania.mokhtar@example.dz', education: 'Université Constantine 2 - Marketing', location: 'Constantine' },
    { fullName: 'Mohamed Amine', email: 'mohamed.amine@example.dz', education: 'Université de Sétif 1 - Génie Civil', location: 'Sétif' },
  ];

  const studentHashes = await Promise.all(
    studentData.map((s) => hashPassword('password123'))
  );

  const students = await Student.insertMany(
    studentData.map((s, i) => ({
      ...s,
      passwordHash: studentHashes[i],
      phone: '0550' + String(100000 + i).slice(-6),
      bio: `طالب في ${s.education}، مهتم بتطوير المهارات المهنية في مجال التخصص.`,
      onboardingMethod: 'manual' as const,
    }))
  );
  console.log(`Created ${students.length} students`);

  // 3. CVs with realistic skills
  const cvData = [
    { studentIdx: 0, name: 'CV - Développement Web', skills: ['React', 'JavaScript', 'TypeScript', 'Node.js', 'CSS', 'HTML', 'Git'] },
    { studentIdx: 0, name: 'CV - Full Stack', skills: ['React', 'Node.js', 'Express.js', 'MongoDB', 'TypeScript', 'Git', 'Docker'] },
    { studentIdx: 1, name: 'CV Principal', skills: ['Python', 'Java', 'Spring Boot', 'Angular', 'SQL', 'Git', 'Docker'] },
    { studentIdx: 2, name: 'CV - IA & Data', skills: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'NLP', 'Pandas', 'NumPy'] },
    { studentIdx: 3, name: 'CV Dev', skills: ['Flutter', 'Dart', 'Firebase', 'Git', 'REST API', 'JavaScript'] },
    { studentIdx: 4, name: 'CV Principal', skills: ['React', 'Node.js', 'TypeScript', 'GraphQL', 'PostgreSQL', 'Git'] },
    { studentIdx: 5, name: 'CV - SI', skills: ['Java', 'Spring Boot', 'MySQL', 'Hibernate', 'JavaScript', 'HTML', 'CSS'] },
    { studentIdx: 6, name: 'CV Marketing', skills: ['SEO', 'Google Analytics', 'Social Media', 'Content Marketing', 'Adobe Photoshop', 'WordPress'] },
    { studentIdx: 7, name: 'CV Finance', skills: ['Excel', 'Comptabilité', 'SAP', 'Analyse Financière', 'Power BI', 'QuickBooks'] },
    { studentIdx: 8, name: 'CV Data', skills: ['Python', 'SQL', 'Machine Learning', 'Pandas', 'Tableau', 'Apache Spark', 'Hadoop'] },
    { studentIdx: 9, name: 'CV Electronique', skills: ['Arduino', 'C++', 'MATLAB', 'Python', 'Embedded Systems', 'PCB Design'] },
    { studentIdx: 10, name: 'CV Design', skills: ['Adobe Photoshop', 'Adobe Illustrator', 'Figma', 'UI/UX', 'Canva', 'InDesign'] },
    { studentIdx: 11, name: 'CV Dev Web', skills: ['Laravel', 'PHP', 'Vue.js', 'MySQL', 'JavaScript', 'Bootstrap', 'Git'] },
    { studentIdx: 12, name: 'CV Cybersécurité', skills: ['Python', 'Linux', 'Network Security', 'Ethical Hacking', 'Wireshark', 'Kali Linux'] },
    { studentIdx: 13, name: 'CV Cloud', skills: ['AWS', 'Docker', 'Kubernetes', 'Terraform', 'Linux', 'Python', 'CI/CD'] },
    { studentIdx: 14, name: 'CV Comptabilité', skills: ['Excel', 'SAP', 'Comptabilité', 'Audit', 'QuickBooks', 'Analyse Financière'] },
    { studentIdx: 15, name: 'CV Mobile', skills: ['Flutter', 'Dart', 'Kotlin', 'Firebase', 'REST API', 'Git', 'Android'] },
    { studentIdx: 16, name: 'CV Marketing Digital', skills: ['SEO', 'Content Marketing', 'Social Media', 'Google Ads', 'Analytics', 'Mailchimp'] },
    { studentIdx: 17, name: 'CV Génie Civil', skills: ['AutoCAD', 'Revit', 'MATLAB', 'C++', 'Project Management', 'Excel'] },
    { studentIdx: 0, name: 'CV - React Spec', skills: ['React', 'TypeScript', 'Next.js', 'Tailwind CSS', 'GraphQL', 'Jest', 'Git'] },
    { studentIdx: 3, name: 'CV Full Stack', skills: ['React', 'Node.js', 'MongoDB', 'Express.js', 'JavaScript', 'Git', 'Bootstrap'] },
    { studentIdx: 8, name: 'CV Python', skills: ['Python', 'Django', 'Flask', 'SQL', 'Docker', 'REST API', 'Git'] },
  ];

  const cvRefs: any[] = [];
  for (const cv of cvData) {
    const student = students[cv.studentIdx];
    const saved = await Cv.create({
      studentId: student._id,
      name: cv.name,
      fileUrl: `https://ik.imagekit.io/stageai/cvs/${student._id}_${cv.name.replace(/\s+/g, '_')}.pdf`,
      fileId: `seed_${student._id}_${cv.name.replace(/\s+/g, '_')}`,
      extractedSkills: cv.skills,
      improvementTips: 'ركز على المشاريع العملية وأضف روابط إلى GitHub الخاص بك.',
    });
    cvRefs.push(saved);
  }
  console.log(`Created ${cvRefs.length} CVs`);

  // 4. Companies
  const companyData = [
    { name: 'DZ Soft Solutions', email: 'contact@dzsoft.dz', description: 'شركة جزائرية متخصصة في تطوير البرمجيات وحلول الويب', location: 'Alger', status: 'approved' as const },
    { name: 'Atlas Digital Agency', email: 'info@atlasdigital.dz', description: 'وكالة تسويق رقمي وتطوير تطبيقات موبايل', location: 'Oran', status: 'approved' as const },
    { name: 'NovaTech Alger', email: 'hr@novatech.dz', description: 'شركة ناشئة في مجال الذكاء الاصطناعي وتحليل البيانات', location: 'Alger', status: 'approved' as const },
    { name: 'GreenCode Studio', email: 'hello@greencode.dz', description: 'استوديو تطوير ويب وتطبيقات بإطارات عمل حديثة', location: 'Constantine', status: 'approved' as const },
    { name: 'CyberShield DZ', email: 'jobs@cybershield.dz', description: 'شركة أمن سيبراني وحماية المعلومات', location: 'Alger', status: 'approved' as const },
    { name: 'FinTech Algeria', email: 'careers@fintechdz.dz', description: 'منصة خدمات مالية رقمية جزائرية', location: 'Sétif', status: 'approved' as const },
    { name: 'DesignLab DZ', email: 'studio@designlabdz.dz', description: 'وكالة تصميم جرافيكي وتجربة مستخدم', location: 'Annaba', status: 'approved' as const },
    { name: 'CloudTech Alger', email: 'info@cloudtech.dz', description: 'مزود خدمات سحابية وحلول DevOps', location: 'Alger', status: 'approved' as const },
    { name: 'EduNext Algeria', email: 'team@edunext.dz', description: 'منصة تعليم إلكتروني جزائرية', location: 'Guelma', status: 'pending' as const },
    { name: 'SmartBuild DZ', email: 'info@smartbuild.dz', description: 'شركة حلول ذكية للبناء والهندسة المدنية', location: 'Béjaïa', status: 'pending' as const },
  ];

  const companyHashes = await Promise.all(
    companyData.map((c) => hashPassword('company123'))
  );
  const companies = await Company.insertMany(
    companyData.map((c, i) => ({
      ...c,
      passwordHash: companyHashes[i],
      logoUrl: '',
    }))
  );
  console.log(`Created ${companies.length} companies`);

  // 5. Offers
  const offerData = [
    { companyIdx: 0, title: 'Développeur React.js Stage', description: 'نبحث عن مطور React.js متحمس للانضمام إلى فريق تطوير الويب لدينا. العمل على مشاريع حقيقية مع إرشاد من مطورين ذوي خبرة.', paymentType: 'paid' as const, employmentType: 'full_time' as const, skills: ['React', 'JavaScript', 'TypeScript', 'CSS', 'HTML', 'Git'], duration: 6, location: 'Alger' },
    { companyIdx: 0, title: 'Développeur Full Stack Node.js', description: 'فرصة تدريب لتطوير تطبيقات ويب كاملة باستخدام Node.js و React. مشاريع متنوعة وبيئة تعلم ممتازة.', paymentType: 'paid' as const, employmentType: 'full_time' as const, skills: ['Node.js', 'React', 'Express.js', 'MongoDB', 'JavaScript', 'Git'], duration: 4, location: 'Alger' },
    { companyIdx: 1, title: 'Assistant Marketing Digital', description: 'انضم إلى فريق التسويق الرقمي لدينا وتعلم أساسيات SEO وإدارة حملات التواصل الاجتماعي.', paymentType: 'paid' as const, employmentType: 'part_time' as const, skills: ['SEO', 'Social Media', 'Content Marketing', 'Google Analytics'], duration: 3, location: 'Oran' },
    { companyIdx: 1, title: 'Développeur Mobile Flutter', description: 'ندرب مطوري Flutter على تطبيقات حقيقية مع إطلاقها على المتاجر.', paymentType: 'unpaid' as const, employmentType: 'full_time' as const, skills: ['Flutter', 'Dart', 'Firebase', 'REST API', 'Git'], duration: 6, location: 'Oran' },
    { companyIdx: 2, title: 'Data Science Intern', description: 'فرصة تدريب في مجال علم البيانات والتعلم الآلي. العمل مع فريق من خبراء AI.', paymentType: 'paid' as const, employmentType: 'full_time' as const, skills: ['Python', 'Machine Learning', 'SQL', 'Pandas', 'NumPy'], duration: 6, location: 'Alger' },
    { companyIdx: 2, title: 'AI Research Assistant', description: 'مساعدة فريق البحث في تطوير نماذج NLP وتحليل النصوص العربية.', paymentType: 'paid' as const, employmentType: 'part_time' as const, skills: ['Python', 'NLP', 'Machine Learning', 'TensorFlow'], duration: 4, location: 'Alger' },
    { companyIdx: 3, title: 'Développeur Web Laravel', description: 'نبحث عن متدرب في Laravel للعمل على منصة إلكترونية. خبرة في PHP و MySQL مطلوبة.', paymentType: 'paid' as const, employmentType: 'hybrid' as const, skills: ['Laravel', 'PHP', 'MySQL', 'JavaScript', 'HTML', 'CSS'], duration: 5, location: 'Constantine' },
    { companyIdx: 3, title: 'Frontend Vue.js Intern', description: 'تدريب في تطوير واجهات المستخدم باستخدام Vue.js. فرصة للعمل على مشروع مثير.', paymentType: 'unpaid' as const, employmentType: 'full_time' as const, skills: ['Vue.js', 'JavaScript', 'CSS', 'HTML', 'Git'], duration: 3, location: 'Constantine' },
    { companyIdx: 4, title: 'Cybersecurity Intern', description: 'تدريب في أمن المعلومات والاختبارات الأمنية. تعلم أدوات الحماية والاختراق الأخلاقي.', paymentType: 'paid' as const, employmentType: 'full_time' as const, skills: ['Linux', 'Network Security', 'Python', 'Wireshark', 'Kali Linux'], duration: 6, location: 'Alger' },
    { companyIdx: 5, title: 'Analyste Financier Stage', description: 'فرصة تدريب في التحليل المالي وإدارة المخاطر. استخدام أدوات تحليل البيانات.', paymentType: 'paid' as const, employmentType: 'full_time' as const, skills: ['Excel', 'Analyse Financière', 'Power BI', 'Comptabilité'], duration: 4, location: 'Sétif' },
    { companyIdx: 6, title: 'Graphic Design Intern', description: 'تدريب في التصميم الجرافيكي وتصميم تجربة المستخدم. العمل مع علامات تجارية حقيقية.', paymentType: 'unpaid' as const, employmentType: 'part_time' as const, skills: ['Adobe Photoshop', 'Adobe Illustrator', 'Figma', 'UI/UX'], duration: 3, location: 'Annaba' },
    { companyIdx: 7, title: 'Cloud DevOps Intern', description: 'تعلم DevOps والحوسبة السحابية مع فريق محترف. فرصة للحصول على شهادات AWS.', paymentType: 'paid' as const, employmentType: 'full_time' as const, skills: ['AWS', 'Docker', 'Linux', 'CI/CD', 'Python', 'Git'], duration: 6, location: 'Alger' },
    { companyIdx: 8, title: 'Développeur Full Stack (E-learning)', description: 'تطوير منصة تعليم إلكتروني باستخدام React و Node.js. مشروع مؤثر.', paymentType: 'unpaid' as const, employmentType: 'remote' as const, skills: ['React', 'Node.js', 'JavaScript', 'MongoDB', 'TypeScript'], duration: 4, location: 'Guelma' },
    { companyIdx: 9, title: 'Ingénieur Civil BIM', description: 'تدريب في نمذجة معلومات البناء (BIM) باستخدام Revit و AutoCAD.', paymentType: 'unpaid' as const, employmentType: 'full_time' as const, skills: ['AutoCAD', 'Revit', 'MATLAB', 'Project Management'], duration: 5, location: 'Béjaïa' },
  ];

  const offers = await Offer.insertMany(
    offerData.map((o) => ({
      companyId: companies[o.companyIdx]._id,
      title: o.title,
      description: o.description,
      paymentType: o.paymentType,
      employmentType: o.employmentType,
      requiredSkills: o.skills,
      durationMonths: o.duration,
      location: o.location,
      isActive: true,
    }))
  );
  console.log(`Created ${offers.length} offers`);

  // 6. Applications
  const appData = [
    { studentIdx: 0, cvIdx: 0, offerIdx: 0, status: 'accepted' as const },
    { studentIdx: 0, cvIdx: 1, offerIdx: 1, status: 'pending' as const },
    { studentIdx: 1, cvIdx: 2, offerIdx: 0, status: 'rejected' as const },
    { studentIdx: 2, cvIdx: 3, offerIdx: 4, status: 'accepted' as const },
    { studentIdx: 2, cvIdx: 3, offerIdx: 5, status: 'pending' as const },
    { studentIdx: 3, cvIdx: 4, offerIdx: 3, status: 'pending' as const },
    { studentIdx: 4, cvIdx: 5, offerIdx: 0, status: 'accepted' as const },
    { studentIdx: 5, cvIdx: 6, offerIdx: 6, status: 'pending' as const },
    { studentIdx: 6, cvIdx: 7, offerIdx: 2, status: 'accepted' as const },
    { studentIdx: 7, cvIdx: 8, offerIdx: 9, status: 'pending' as const },
    { studentIdx: 8, cvIdx: 9, offerIdx: 4, status: 'rejected' as const },
    { studentIdx: 8, cvIdx: 9, offerIdx: 11, status: 'pending' as const },
    { studentIdx: 11, cvIdx: 12, offerIdx: 6, status: 'accepted' as const },
    { studentIdx: 12, cvIdx: 13, offerIdx: 8, status: 'pending' as const },
    { studentIdx: 13, cvIdx: 14, offerIdx: 11, status: 'accepted' as const },
    { studentIdx: 15, cvIdx: 15, offerIdx: 3, status: 'rejected' as const },
  ];

  const applications = await Application.insertMany(
    appData.map((a) => {
      const student = students[a.studentIdx];
      const cv = cvRefs[a.cvIdx];
      const offer = offers[a.offerIdx];
      const matchPct = Math.round(
        (cv.extractedSkills.filter((s: string) => offer.requiredSkills.includes(s)).length /
          offer.requiredSkills.length) *
          100
      );
      return {
        studentId: student._id,
        cvId: cv._id,
        offerId: offer._id,
        motivationLetter: `أتقدم بطلب للانضمام إلى تدريب "${offer.title}" في ${companies.find(c => c._id.toString() === (offer as any).companyId?.toString())?.name || ''}. أمتلك مهارات في ${cv.extractedSkills.slice(0, 4).join(', ')} وأتطلع للمساهمة في فريقكم وتطوير مهاراتي.`,
        matchPercentageSnapshot: matchPct,
        status: a.status,
      };
    })
  );
  console.log(`Created ${applications.length} applications`);

  console.log('\n=== Seed completed successfully ===');
  console.log(`Admin: admin@stageai.dz / ${ADMIN_PASSWORD}`);
  console.log(`Students password: password123`);
  console.log(`Companies password: company123`);

  process.exit(0);
}

seed().catch((err) => {
  console.error('Seed failed:', err);
  process.exit(1);
});

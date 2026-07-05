import groq, { GROQ_MODEL } from '../config/groq';

async function groqChat(systemPrompt: string, userPrompt: string) {
  console.log('[groqChat] calling API with model=%s', GROQ_MODEL);
  const start = Date.now();
  const response = await groq.chat.completions.create({
    model: GROQ_MODEL,
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userPrompt },
    ],
    temperature: 0.3,
  });
  const elapsed = Date.now() - start;
  const content = response.choices[0]?.message?.content || '';
  console.log('[groqChat] API returned in %dms, content length=%d', elapsed, content.length);
  if (!content) {
    console.warn('[groqChat] content is empty! full response:', JSON.stringify(response));
  }
  return content;
}

function extractJson(raw: string): Record<string, unknown> | null {
  const trimmed = raw.trim();
  const braceEnd = trimmed.lastIndexOf('}');
  if (braceEnd === -1) {
    try { return JSON.parse(trimmed); } catch { return null; }
  }
  const beforeEnd = trimmed.slice(0, braceEnd);
  const braceStart = beforeEnd.lastIndexOf('{');
  if (braceStart !== -1) {
    const candidate = trimmed.slice(braceStart, braceEnd + 1);
    try { return JSON.parse(candidate); } catch { /* continue */ }
  }
  return null;
}

export async function extractProfileFromText(text: string) {
  const systemPrompt = `أنت مساعد استخراج بيانات من السيرة الذاتية. أعد JSON فقط:
{"fullName":"","phone":"","location":"","education":"","bio":""}
إذا لم تجد معلومة اترك الحقل فارغًا. لا تخترع معلومات.`;

  try {
    const raw = await groqChat(systemPrompt, text);
    const parsed = extractJson(raw) || {};
    return {
      fullName: (parsed.fullName as string) || '',
      phone: (parsed.phone as string) || '',
      location: (parsed.location as string) || '',
      education: (parsed.education as string) || '',
      bio: (parsed.bio as string) || '',
    };
  } catch (err) {
    console.error('[aiService] extractProfileFromText error:', err);
    return { fullName: '', phone: '', location: '', education: '', bio: '' };
  }
}

export async function extractSkillsFromText(text: string): Promise<string[]> {
  const systemPrompt = `أنت مساعد استخراج المهارات من السيرة الذاتية. أخرج قائمة المهارات الموجودة في النص بصيغة JSON. لا تفكر، لا تشرح، أخرج فقط JSON بالصيغة: {"skills":["المهارة1","المهارة2"]} استخدم أسماء مهارات معروفة (React, Node.js, Python, Laravel, MySQL, ...). كن شاملاً وواقعيًا.`;

  try {
    const raw = await groqChat(systemPrompt, text);
    const lastPart = raw.length > 300 ? '...' + raw.slice(-300) : raw;
    console.log('[aiService] extractSkillsFromText response length:', raw.length, 'last 300:', lastPart);
    const parsed = extractJson(raw);
    console.log('[aiService] extractSkillsFromText parsed:', JSON.stringify(parsed));
    if (parsed && Array.isArray(parsed.skills)) {
      console.log('[aiService] extractSkillsFromText found skills:', parsed.skills);
      return parsed.skills as string[];
    }
    if (parsed && typeof parsed.skills === 'string') {
      const split = (parsed.skills as string).split(/[,،،\n]+/).map(s => s.trim()).filter(Boolean);
      console.log('[aiService] extractSkillsFromText split string skills:', split);
      return split;
    }
    console.log('[aiService] extractSkillsFromText: parsed keys:', Object.keys(parsed || {}), 'raw last 500:', raw.slice(-500));
    return [];
  } catch (err) {
    console.error('[aiService] extractSkillsFromText error:', err);
    return [];
  }
}

export async function generateImprovementTips(skills: string[], rawText?: string): Promise<string> {
  const systemPrompt = `أنت مستشار مهني متخصص. أعد JSON فقط:
{"tips":"نص النصيحة هنا"}
قدم نصائح تطوير السيرة الذاتية بالعربية.`;

  const input = `المهارات: ${skills.join(', ')}${rawText ? `\nالنص:\n${rawText.substring(0, 2000)}` : ''}`;

  try {
    const raw = await groqChat(systemPrompt, input);
    const parsed = extractJson(raw);
    return (parsed?.tips as string) || '';
  } catch (err) {
    console.error('[aiService] generateImprovementTips error:', err);
    return 'حاول إضافة مهارات تقنية جديدة ومشاريع عملية لتقوية سيرتك الذاتية.';
  }
}

export async function generateMatchAdvice(
  cvSkills: string[],
  offerSkills: string[],
  offerDescription: string
): Promise<string> {
  const systemPrompt = `أنت مستشار مهني متخصص. أعد JSON فقط:
{"advice":"نص النصيحة هنا"}
قدم نصائح للطالب لتحسين فرصه بالتقديم على عرض تدريب.`;

  const input = `مهارات الطالب: ${cvSkills.join(', ')}
المهارات المطلوبة: ${offerSkills.join(', ')}
المهارات المفقودة: ${offerSkills.filter(s => !cvSkills.includes(s)).join(', ')}
وصف العرض: ${offerDescription}`;

  try {
    const raw = await groqChat(systemPrompt, input);
    const parsed = extractJson(raw);
    return (parsed?.advice as string) || '';
  } catch (err) {
    console.error('[aiService] generateMatchAdvice error:', err);
    return 'ركز على تطوير المهارات المطلوبة في هذا العرض لزيادة فرص قبولك.';
  }
}

export async function generateMotivationLetter(
  studentName: string,
  studentBio: string,
  cvSkills: string[],
  offerTitle: string,
  offerDescription: string,
  companyName: string
): Promise<string> {
  const systemPrompt = `أنت كاتب محترف لرسائل التحفيز والتقديم للتدريب. أعد JSON فقط:
{"letter":"نص الرسالة كاملاً"}
اكتب رسالة تحفيز احترافية ومقنعة بالعربية.`;

  const input = `اسم الطالب: ${studentName}
نبذة: ${studentBio}
مهارات: ${cvSkills.join(', ')}
العرض: ${offerTitle}
الوصف: ${offerDescription}
الشركة: ${companyName}`;

  console.log('[aiService] generateMotivationLetter: studentName=%s, cvSkills=%s, offerTitle=%s, companyName=%s',
    studentName, JSON.stringify(cvSkills), offerTitle, companyName);
  console.log('[aiService] input prompt:\n%s', input);

  try {
    const raw = await groqChat(systemPrompt, input);
    console.log('[aiService] raw Groq response length=%d, full response:\n%s', raw.length, raw);
    const parsed = extractJson(raw);
    console.log('[aiService] extractJson parsed:', JSON.stringify(parsed));
    const result = (parsed?.letter as string) || '';
    console.log('[aiService] result letter length=%d, first 200 chars=%s', result.length, result.substring(0, 200));
    if (!result) {
      console.warn('[aiService] letter is empty after parsing! raw last 500: %s', raw.slice(-500));
    }
    return result;
  } catch (err) {
    console.error('[aiService] generateMotivationLetter error:', err);
    const fallback = `السلام عليكم،\n\nأتقدم بطلبي للانضمام إلى تدريب "${offerTitle}" في ${companyName}. أمتلك خبرة في ${cvSkills.slice(0, 3).join(', ')} وأتطلع للمساهمة في فريقكم.\n\nشكراً لكم.`;
    console.log('[aiService] returning fallback letter length=%d', fallback.length);
    return fallback;
  }
}

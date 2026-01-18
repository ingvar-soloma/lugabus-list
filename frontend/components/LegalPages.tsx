import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Brain, AlertTriangle, Scale, EyeOff, Trash2, Mail } from 'lucide-react';
import { ThemeClasses } from '../types';

interface LegalPageProps {
  themeClasses: ThemeClasses;
}

export const TermsOfServicePage: React.FC<LegalPageProps> = ({ themeClasses }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-12 py-10 max-w-4xl mx-auto"
  >
    <div className="text-center space-y-4">
      <h1
        className={`text-6xl font-montserrat font-bold tracking-tighter uppercase italic ${themeClasses.textMain}`}
      >
        Умови<span className="text-red-600">.org</span>
      </h1>
      <p className="text-zinc-500 font-black uppercase tracking-widest text-xs">
        Юридична відмова від відповідальності та правила платформи
      </p>
    </div>

    <div className="grid gap-8">
      <div className={`p-10 border rounded-none space-y-6 ${themeClasses.card}`}>
        <div className="flex items-center space-x-4 mb-2">
          <div className="bg-red-600/10 p-3 rounded-none text-red-600">
            <Scale size={24} />
          </div>
          <h3
            className={`text-2xl font-black uppercase tracking-tight italic ${themeClasses.textMain}`}
          >
            01. Статус платформи
          </h3>
        </div>
        <p className={`${themeClasses.textMuted} leading-relaxed font-medium`}>
          Сайт LugaBus.org є інтерактивним майданчиком для обміну інформацією (intermediary service
          provider). Адміністрація не є автором контенту, за винятком випадків, де це прямо вказано.
          Ми надаємо технологічну платформу для документування та аналізу публічної діяльності.
        </p>
      </div>

      <div className={`p-10 border rounded-none space-y-6 ${themeClasses.card}`}>
        <div className="flex items-center space-x-4 mb-2">
          <div className="bg-red-600/10 p-3 rounded-none text-red-600">
            <Brain size={24} />
          </div>
          <h3
            className={`text-2xl font-black uppercase tracking-tight italic ${themeClasses.textMain}`}
          >
            02. Оціночні судження (AI)
          </h3>
        </div>
        <p className={`${themeClasses.textMuted} leading-relaxed font-medium`}>
          Всі теги (наприклад, "Корупційний ризик", "Перевзування"), згенеровані AI, є оціночними
          судженнями, базованими на аналізі доступних даних, а не констатацією юридичного факту.
          Алгоритми ШІ аналізують тональність та контекст посилань, наданих спільнотою.
        </p>
      </div>

      <div className={`p-10 border rounded-none space-y-6 ${themeClasses.card}`}>
        <div className="flex items-center space-x-4 mb-2">
          <div className="bg-red-600/10 p-3 rounded-none text-red-600">
            <AlertTriangle size={24} />
          </div>
          <h3
            className={`text-2xl font-black uppercase tracking-tight italic ${themeClasses.textMain}`}
          >
            03. Відсутність гарантій
          </h3>
        </div>
        <p className={`${themeClasses.textMuted} leading-relaxed font-medium`}>
          Інформація надається за принципом "як є". Платформа не гарантує 100% точність даних,
          оскільки вони базуються на відкритих джерелах та внесках спільноти. Ми закликаємо
          користувачів самостійно перевіряти першоджерела.
        </p>
      </div>

      <div className={`p-10 border rounded-none space-y-6 ${themeClasses.card}`}>
        <div className="flex items-center space-x-4 mb-2">
          <div className="bg-red-600/10 p-3 rounded-none text-red-600">
            <Mail size={24} />
          </div>
          <h3
            className={`text-2xl font-black uppercase tracking-tight italic ${themeClasses.textMain}`}
          >
            04. Механізм апеляції
          </h3>
        </div>
        <p className={`${themeClasses.textMuted} leading-relaxed font-medium`}>
          Якщо ви вважаєте інформацію недостовірною, скористайтеся формою спростування або
          зверніться до нас. Ми надаємо право на відповідь кожній публічній особі, згаданій у
          реєстрі.
        </p>
      </div>
    </div>
  </motion.div>
);

export const PrivacyPolicyPage: React.FC<LegalPageProps> = ({ themeClasses }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-12 py-10 max-w-4xl mx-auto"
  >
    <div className="text-center space-y-4">
      <h1
        className={`text-6xl font-montserrat font-bold tracking-tighter uppercase italic ${themeClasses.textMain}`}
      >
        Приватність<span className="text-red-600">.org</span>
      </h1>
      <p className="text-zinc-500 font-black uppercase tracking-widest text-xs">
        Privacy by Design & Data Minimization
      </p>
    </div>

    <div className="grid gap-8">
      <div className={`p-10 border rounded-none space-y-6 ${themeClasses.card}`}>
        <div className="flex items-center space-x-4 mb-2">
          <div className="bg-red-600/10 p-3 rounded-none text-red-600">
            <EyeOff size={24} />
          </div>
          <h3
            className={`text-2xl font-black uppercase tracking-tight italic ${themeClasses.textMain}`}
          >
            01. Мінімізація даних
          </h3>
        </div>
        <p className={`${themeClasses.textMuted} leading-relaxed font-medium`}>
          Ми використовуємо технічні методи ідентифікації (Browser Fingerprinting) виключно для
          захисту від спаму та атак. Ми не збираємо ваші ПІБ, IP-адресу чи e-mail. Всі ID
          користувачів є анонімізованими хешами (pHash).
        </p>
      </div>

      <div className={`p-10 border rounded-none space-y-6 ${themeClasses.card}`}>
        <div className="flex items-center space-x-4 mb-2">
          <div className="bg-red-600/10 p-3 rounded-none text-red-600">
            <Shield size={24} />
          </div>
          <h3
            className={`text-2xl font-black uppercase tracking-tight italic ${themeClasses.textMain}`}
          >
            02. Публічні особи
          </h3>
        </div>
        <p className={`${themeClasses.textMuted} leading-relaxed font-medium`}>
          GDPR дозволяє обробку даних публічних осіб без їх згоди, якщо вони стосуються їхньої
          професійної чи політичної діяльності (суспільний інтерес). Ми вилучаємо "чутливі" дані
          (адреси, особисті телефони) за запитом протягом 48 годин.
        </p>
      </div>

      <div className={`p-10 border rounded-none space-y-6 ${themeClasses.card}`}>
        <div className="flex items-center space-x-4 mb-2">
          <div className="bg-red-600/10 p-3 rounded-none text-red-600">
            <Trash2 size={24} />
          </div>
          <h3
            className={`text-2xl font-black uppercase tracking-tight italic ${themeClasses.textMain}`}
          >
            03. Право на видалення
          </h3>
        </div>
        <p className={`${themeClasses.textMuted} leading-relaxed font-medium`}>
          Оскільки ми зберігаємо лише pHash, видалення акаунта означає видалення зв'язку між ключем
          користувача та базою даних. Будь-які завантажені вами метадані (GPS, дані пристрою)
          видаляються автоматично при завантаженні.
        </p>
      </div>
    </div>
  </motion.div>
);

export const AboutAIPage: React.FC<LegalPageProps> = ({ themeClasses }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="space-y-12 py-10 max-w-4xl mx-auto"
  >
    <div className="text-center space-y-4">
      <h1
        className={`text-6xl font-montserrat font-bold tracking-tighter uppercase italic ${themeClasses.textMain}`}
      >
        Як працює<span className="text-red-600 ml-4">AI</span>
      </h1>
      <p className="text-zinc-500 font-black uppercase tracking-widest text-xs">
        Прозорість алгоритмів та Right to Explanation
      </p>
    </div>

    <div className={`p-12 border rounded-none relative overflow-hidden ${themeClasses.card}`}>
      <div className="absolute top-0 right-0 p-12 text-red-600/5">
        <Brain size={160} />
      </div>

      <div className="relative z-10 space-y-8">
        <div className="space-y-4">
          <h3
            className={`text-3xl font-black uppercase tracking-tight italic ${themeClasses.textMain}`}
          >
            Алгоритми аналізу
          </h3>
          <p className={`${themeClasses.textMuted} text-lg leading-relaxed font-medium`}>
            Наш AI аналізує посилання, цитати та архівні копії документів. Він оцінює послідовність
            заяв публічної особи та їх відповідність фактам.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className={`p-6 rounded-none border ${themeClasses.card}`}>
            <h4 className="font-black text-red-600 uppercase text-xs tracking-widest mb-2">
              Статус: Неостаточне рішення
            </h4>
            <p className={`text-sm leading-relaxed font-medium ${themeClasses.textMuted}`}>
              Автоматичне рішення ШІ не є остаточним і може бути змінене модератором-людиною або
              через процедуру апеляції суб'єктом даних.
            </p>
          </div>
          <div className={`p-6 rounded-none border ${themeClasses.card}`}>
            <h4 className="font-black text-red-600 uppercase text-xs tracking-widest mb-2">
              Джерела: Тільки верифіковані
            </h4>
            <p className={`text-sm leading-relaxed font-medium ${themeClasses.textMuted}`}>
              ШІ надає більшу вагу офіційним реєстрам, відео-доказам та архівним копіям (Wayback
              Machine), ніж публікаціям у соцмережах.
            </p>
          </div>
        </div>
      </div>
    </div>
  </motion.div>
);

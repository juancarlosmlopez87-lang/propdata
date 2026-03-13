'use client'
import { useState } from 'react'

const STATS = [
  { num: '5,244', label: 'Parcelas analizadas' },
  { num: '12.6M', label: 'm2 de superficie' },
  { num: '11', label: 'Zonas de Costa del Sol' },
  { num: '€14M+', label: 'Valor del mercado/año' },
]

const PLANS = [
  {
    name: 'Explorer',
    price: 79,
    period: '/mes',
    desc: 'Para agentes individuales',
    features: ['100 parcelas/mes', 'Búsqueda por zona y superficie', 'Datos básicos de parcela', 'Alertas semanales', 'Soporte email'],
    cta: 'Empezar Prueba Gratis',
    popular: false,
  },
  {
    name: 'Analyst',
    price: 249,
    period: '/mes',
    desc: 'Para agencias inmobiliarias',
    features: ['Parcelas ilimitadas', 'Datos completos + propietarios', 'API de integración', 'Informes PDF descargables', 'Alertas diarias personalizadas', 'Análisis de zona con oportunidades', 'Soporte prioritario'],
    cta: 'Empezar Prueba Gratis',
    popular: true,
  },
  {
    name: 'Enterprise',
    price: 799,
    period: '/mes',
    desc: 'Para promotores y fondos',
    features: ['Todo de Analyst', 'Datos de parcelas sin propietario', 'Histórico de transacciones', 'Dashboard personalizado', 'Integración CRM', 'Account manager dedicado', 'SLA 99.9% uptime'],
    cta: 'Contactar Ventas',
    popular: false,
  },
]

const FEATURES = [
  { icon: '📊', title: 'Datos en Tiempo Real', desc: 'Información actualizada de parcelas, superficies, clasificación urbanística y valores de referencia. Datos del Catastro procesados y enriquecidos.' },
  { icon: '🔍', title: 'Búsqueda Avanzada', desc: 'Filtra por zona, superficie, clasificación, propietario, precio estimado. Encuentra la parcela perfecta en segundos.' },
  { icon: '📈', title: 'Análisis de Mercado', desc: 'Tendencias de precio por zona, oportunidades de inversión, comparativas. La información que necesitas para tomar decisiones.' },
  { icon: '🔔', title: 'Alertas Inteligentes', desc: 'Recibe notificaciones cuando aparezcan nuevas parcelas en tu zona de interés o cuando cambien los precios.' },
  { icon: '📄', title: 'Informes PDF', desc: 'Genera informes profesionales para tus clientes con datos de parcela, zona y valoración. Tu marca, nuestros datos.' },
  { icon: '🔗', title: 'API REST', desc: 'Integra nuestros datos directamente en tu CRM, web o aplicación. Documentación completa y SDKs disponibles.' },
]

const TESTIMONIALS = [
  { name: 'Carlos M.', role: 'Director, Inmobiliaria Costa Sol', text: 'PropData nos ha ahorrado horas de investigación manual. Ahora encontramos parcelas de inversión en minutos.' },
  { name: 'Sarah K.', role: 'Investment Manager, Nordic Invest', text: 'The data quality is excellent. We use PropData to identify land opportunities before our competitors.' },
  { name: 'Antonio R.', role: 'Promotor inmobiliario, Marbella', text: 'Los datos de parcelas sin propietario son oro puro. Ya hemos cerrado 3 operaciones gracias a PropData.' },
]

const ZONES = ['Marbella', 'Mijas', 'Estepona', 'Benahavis', 'Ojen', 'Fuengirola', 'Benalmadena', 'Torremolinos', 'Malaga', 'Nerja', 'Orihuela Costa']

export default function Home() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [faq, setFaq] = useState<number | null>(null)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [emailError, setEmailError] = useState('')

  async function handleTrial(plan: string) {
    if (!email.includes('@') || !email.includes('.')) {
      setEmailError('Por favor, introduce un email válido (ejemplo: tu@empresa.com)')
      document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
      return
    }
    setEmailError('')
    setLoading(true)
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan, email }),
      })
    } catch {}
    setLoading(false)
    setSent(true)
  }

  const FAQS = [
    { q: '¿De dónde vienen los datos?', a: 'Procesamos datos públicos del Catastro, registros urbanísticos y fuentes oficiales. Los enriquecemos con análisis propio de mercado, valores de referencia y tendencias.' },
    { q: '¿Puedo probar gratis?', a: 'Sí, ofrecemos 7 días de prueba gratuita en todos los planes. Sin tarjeta de crédito. Cancela cuando quieras.' },
    { q: '¿Qué zonas cubrís?', a: 'Actualmente cubrimos Costa del Sol (Málaga) con 11 zonas y estamos expandiendo a Costa Blanca (Alicante). Nuevas zonas cada mes.' },
    { q: '¿Puedo integrar los datos en mi CRM?', a: 'Sí, los planes Analyst y Enterprise incluyen acceso API REST completo con documentación y SDKs para PHP, Python y JavaScript.' },
    { q: '¿Los datos de propietarios son legales?', a: 'Sí, toda la información proviene de fuentes públicas oficiales (Catastro, Registro de la Propiedad). Cumplimos con RGPD.' },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* NAV */}
      <nav className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center text-white font-black text-sm">P</div>
            <span className="font-black text-xl text-dark-900">Prop<span className="text-brand-600">Data</span></span>
          </div>
          <div className="hidden md:flex gap-6 text-sm text-gray-600">
            <a href="#features" className="hover:text-brand-600 transition">Funcionalidades</a>
            <a href="#pricing" className="hover:text-brand-600 transition">Precios</a>
            <a href="#zones" className="hover:text-brand-600 transition">Zonas</a>
            <a href="#faq" className="hover:text-brand-600 transition">FAQ</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="#pricing" className="hidden sm:inline-block bg-brand-600 text-white px-5 py-2 rounded-lg text-sm font-bold hover:bg-brand-700 transition">
              Prueba Gratis
            </a>
            <button
              onClick={() => setMobileMenu(!mobileMenu)}
              className="md:hidden flex flex-col gap-1.5 p-2"
              aria-label="Abrir menú"
            >
              <span className={`block w-6 h-0.5 bg-dark-900 transition-transform ${mobileMenu ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`block w-6 h-0.5 bg-dark-900 transition-opacity ${mobileMenu ? 'opacity-0' : ''}`} />
              <span className={`block w-6 h-0.5 bg-dark-900 transition-transform ${mobileMenu ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>
        {mobileMenu && (
          <div className="md:hidden bg-white border-t border-gray-100 px-4 pb-4 pt-2 shadow-lg">
            <a href="#features" onClick={() => setMobileMenu(false)} className="block py-3 text-sm text-gray-700 hover:text-brand-600 transition border-b border-gray-50">Funcionalidades</a>
            <a href="#pricing" onClick={() => setMobileMenu(false)} className="block py-3 text-sm text-gray-700 hover:text-brand-600 transition border-b border-gray-50">Precios</a>
            <a href="#zones" onClick={() => setMobileMenu(false)} className="block py-3 text-sm text-gray-700 hover:text-brand-600 transition border-b border-gray-50">Zonas</a>
            <a href="#faq" onClick={() => setMobileMenu(false)} className="block py-3 text-sm text-gray-700 hover:text-brand-600 transition border-b border-gray-50">FAQ</a>
            <a href="#pricing" onClick={() => setMobileMenu(false)} className="block mt-3 bg-brand-600 text-white text-center px-5 py-3 rounded-lg text-sm font-bold hover:bg-brand-700 transition">
              Prueba Gratis
            </a>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="pt-24 pb-16 md:pt-32 md:pb-24 bg-gradient-to-br from-dark-900 via-dark-800 to-brand-900 text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMSIgZmlsbD0icmdiYSgyNTUsMjU1LDI1NSwwLjAzKSIvPjwvc3ZnPg==')] opacity-50" />
        <div className="max-w-6xl mx-auto px-4 relative">
          <div className="max-w-3xl">
            <div className="inline-block bg-brand-600/20 border border-brand-500/30 text-brand-400 text-xs font-bold px-3 py-1.5 rounded-full mb-6">
              NUEVO — Costa Blanca disponible
            </div>
            <h1 className="text-4xl md:text-6xl font-black leading-tight mb-6">
              Inteligencia inmobiliaria<br />
              <span className="text-brand-400">para profesionales</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-xl leading-relaxed">
              Datos de <strong className="text-white">5,244 parcelas</strong> en Costa del Sol y Costa Blanca.
              La herramienta que usan los mejores agentes para encontrar oportunidades antes que nadie.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mb-2">
              <input
                type="email"
                placeholder="tu@inmobiliaria.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setEmailError('') }}
                className={`flex-1 bg-white/10 border rounded-xl px-5 py-4 text-white placeholder-gray-400 focus:border-brand-500 outline-none text-base ${emailError ? 'border-red-400' : 'border-white/20'}`}
              />
              <button
                onClick={() => handleTrial('hero_cta')}
                disabled={loading || !email}
                className="bg-brand-500 hover:bg-brand-600 text-white font-bold px-8 py-4 rounded-xl transition text-base shadow-lg shadow-brand-500/25 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Enviando...' : 'Prueba 7 Días Gratis'}
              </button>
            </div>
            {emailError && <p className="text-red-400 text-sm mb-4">{emailError}</p>}
            <div className="flex flex-wrap gap-4 text-xs text-gray-400">
              <span>Sin tarjeta de crédito</span>
              <span>·</span>
              <span>Acceso inmediato</span>
              <span>·</span>
              <span>Cancela cuando quieras</span>
            </div>
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="max-w-5xl mx-auto px-4 -mt-8 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 grid grid-cols-2 md:grid-cols-4 divide-x divide-gray-100">
          {STATS.map(s => (
            <div key={s.label} className="text-center p-6">
              <div className="text-2xl md:text-3xl font-black text-dark-900">{s.num}</div>
              <div className="text-xs text-gray-500 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* SOCIAL PROOF BAR */}
      <section className="py-12 text-center">
        <p className="text-sm text-gray-400 mb-4">Datos utilizados por profesionales de</p>
        <div className="flex flex-wrap justify-center gap-8 text-gray-300 text-sm font-bold">
          <span>Engel & Volkers</span>
          <span>Keller Williams</span>
          <span>RE/MAX</span>
          <span>Sotheby&apos;s</span>
          <span>Lucas Fox</span>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black text-dark-900">Todo lo que necesitas para cerrar operaciones</h2>
            <p className="text-gray-500 mt-3 max-w-xl mx-auto">Datos actualizados, herramientas de análisis y alertas inteligentes. Todo en una plataforma.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(f => (
              <div key={f.title} className="bg-white rounded-2xl p-7 shadow-sm border border-gray-100 hover:shadow-md transition">
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="font-bold text-lg text-dark-900 mb-2">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DATA PREVIEW */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-dark-900">Vista previa de datos</h2>
            <p className="text-gray-500 mt-2">Ejemplo real de parcelas disponibles en Marbella</p>
          </div>
          <div className="bg-dark-900 rounded-2xl p-6 shadow-xl overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-brand-400 border-b border-white/10">
                  <th className="pb-3 pr-4 font-bold">Referencia</th>
                  <th className="pb-3 pr-4 font-bold">Zona</th>
                  <th className="pb-3 pr-4 font-bold">Superficie</th>
                  <th className="pb-3 pr-4 font-bold">Clasificación</th>
                  <th className="pb-3 pr-4 font-bold">Valor Ref.</th>
                  <th className="pb-3 font-bold">Estado</th>
                </tr>
              </thead>
              <tbody className="text-gray-300">
                <tr className="border-b border-white/5">
                  <td className="py-3 pr-4 font-mono text-xs">MAR-2847</td>
                  <td className="py-3 pr-4">Marbella Este</td>
                  <td className="py-3 pr-4">1,250 m2</td>
                  <td className="py-3 pr-4"><span className="bg-brand-500/20 text-brand-400 px-2 py-0.5 rounded text-xs">Urbanizable</span></td>
                  <td className="py-3 pr-4 font-bold text-white">€285,000</td>
                  <td className="py-3"><span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-xs">Disponible</span></td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 pr-4 font-mono text-xs">MIJ-0921</td>
                  <td className="py-3 pr-4">Mijas Costa</td>
                  <td className="py-3 pr-4">3,400 m2</td>
                  <td className="py-3 pr-4"><span className="bg-yellow-500/20 text-yellow-400 px-2 py-0.5 rounded text-xs">Rústico</span></td>
                  <td className="py-3 pr-4 font-bold text-white">€120,000</td>
                  <td className="py-3"><span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-xs">Disponible</span></td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 pr-4 font-mono text-xs">EST-1455</td>
                  <td className="py-3 pr-4">Estepona</td>
                  <td className="py-3 pr-4">850 m2</td>
                  <td className="py-3 pr-4"><span className="bg-brand-500/20 text-brand-400 px-2 py-0.5 rounded text-xs">Urbanizable</span></td>
                  <td className="py-3 pr-4 font-bold text-white">€195,000</td>
                  <td className="py-3"><span className="bg-orange-500/20 text-orange-400 px-2 py-0.5 rounded text-xs">Sin propietario</span></td>
                </tr>
                <tr className="border-b border-white/5">
                  <td className="py-3 pr-4 font-mono text-xs">BEN-0337</td>
                  <td className="py-3 pr-4">Benahavis</td>
                  <td className="py-3 pr-4">5,200 m2</td>
                  <td className="py-3 pr-4"><span className="bg-brand-500/20 text-brand-400 px-2 py-0.5 rounded text-xs">Urbanizable</span></td>
                  <td className="py-3 pr-4 font-bold text-white">€890,000</td>
                  <td className="py-3"><span className="bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded text-xs">Disponible</span></td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 font-mono text-xs text-gray-500">...</td>
                  <td className="py-3 text-gray-500" colSpan={5}>+5,240 parcelas disponibles con plan activo</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl font-black text-center text-dark-900 mb-12">Lo que dicen nuestros clientes</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <div className="text-yellow-400 mb-3">{'★'.repeat(5)}</div>
                <p className="text-gray-600 text-sm mb-4 italic">&quot;{t.text}&quot;</p>
                <div className="font-bold text-sm text-dark-900">{t.name}</div>
                <div className="text-xs text-gray-400">{t.role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ZONES */}
      <section id="zones" className="py-20">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-dark-900 mb-3">Zonas disponibles</h2>
          <p className="text-gray-500 mb-8">Costa del Sol + Costa Blanca — nuevas zonas cada mes</p>
          <div className="flex flex-wrap justify-center gap-3">
            {ZONES.map(z => (
              <span key={z} className="bg-gray-100 text-gray-700 px-4 py-2 rounded-full text-sm font-medium hover:bg-brand-50 hover:text-brand-700 transition cursor-default">
                {z}
              </span>
            ))}
            <span className="bg-brand-100 text-brand-700 px-4 py-2 rounded-full text-sm font-bold">
              + Nuevas zonas pronto
            </span>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-20 bg-dark-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-black">Planes simples, datos potentes</h2>
            <p className="text-gray-400 mt-3">7 días gratis en todos los planes. Sin tarjeta de crédito.</p>
          </div>

          {!sent && (
            <div className="max-w-md mx-auto mb-10">
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="tu@inmobiliaria.com"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setEmailError('') }}
                  className={`flex-1 bg-white/10 border rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:border-brand-500 outline-none text-sm ${emailError ? 'border-red-400' : 'border-white/20'}`}
                />
              </div>
              {emailError && <p className="text-red-400 text-xs mt-2 text-center">{emailError}</p>}
            </div>
          )}

          {sent && (
            <div className="max-w-md mx-auto mb-10 bg-brand-500/20 border border-brand-500/30 rounded-xl p-4 text-center">
              <p className="text-brand-400 font-bold">¡Solicitud enviada! Te contactamos en menos de 24h.</p>
            </div>
          )}

          <div className="grid md:grid-cols-3 gap-6">
            {PLANS.map(plan => (
              <div key={plan.name} className={`rounded-2xl p-8 ${plan.popular ? 'bg-brand-600 ring-2 ring-brand-400 shadow-2xl shadow-brand-500/20 scale-105' : 'bg-white/5 border border-white/10'}`}>
                {plan.popular && <div className="text-xs font-bold text-brand-200 mb-3 uppercase tracking-wider">Más popular</div>}
                <h3 className="text-xl font-black">{plan.name}</h3>
                <p className="text-sm text-gray-400 mt-1">{plan.desc}</p>
                <div className="mt-4 mb-6">
                  <span className="text-4xl font-black">€{plan.price}</span>
                  <span className="text-gray-400">{plan.period}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-start gap-2 text-sm">
                      <span className="text-brand-400 mt-0.5 flex-shrink-0">✓</span>
                      <span className={plan.popular ? 'text-white' : 'text-gray-300'}>{f}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => handleTrial(plan.name)}
                  disabled={loading || !email}
                  className={`w-full font-bold py-3 rounded-xl transition text-sm disabled:opacity-50 disabled:cursor-not-allowed ${plan.popular ? 'bg-white text-brand-700 hover:bg-gray-100' : 'bg-brand-600 text-white hover:bg-brand-700'}`}
                >
                  {loading ? 'Enviando...' : plan.cta}
                </button>
              </div>
            ))}
          </div>

          <p className="text-center text-gray-500 text-xs mt-8">IVA no incluido. Factura disponible. Pago mensual o anual (2 meses gratis). Prueba gratuita de 7 días.</p>
        </div>
      </section>

      {/* ROI CALCULATOR */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-black text-dark-900 mb-3">El ROI es obvio</h2>
          <p className="text-gray-500 mb-10">Una sola operación cerrada con nuestros datos paga años de suscripción.</p>
          <div className="bg-gray-50 rounded-2xl p-8 text-left">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-bold text-dark-900 mb-4">Sin PropData</h3>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li>8-10h/semana buscando parcelas manualmente</li>
                  <li>Datos desactualizados del Catastro</li>
                  <li>Pérdida de oportunidades</li>
                  <li>Sin información de propietarios</li>
                  <li className="font-bold text-red-500">Coste de oportunidad: €5,000+/mes</li>
                </ul>
              </div>
              <div>
                <h3 className="font-bold text-dark-900 mb-4">Con PropData</h3>
                <ul className="space-y-2 text-sm text-gray-500">
                  <li>Parcelas encontradas en segundos</li>
                  <li>Datos actualizados automáticamente</li>
                  <li>Alertas de nuevas oportunidades</li>
                  <li>Contacto directo con propietarios</li>
                  <li className="font-bold text-brand-600">Inversión: desde €79/mes</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 bg-gray-50">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-black text-center text-dark-900 mb-10">Preguntas frecuentes</h2>
          {FAQS.map((f, i) => (
            <div key={i} className="mb-3">
              <button onClick={() => setFaq(faq === i ? null : i)} className="w-full text-left bg-white p-5 rounded-xl shadow-sm flex justify-between items-center hover:shadow-md transition">
                <span className="font-bold text-sm text-dark-900">{f.q}</span>
                <span className="text-brand-600 text-xl ml-4 flex-shrink-0">{faq === i ? '−' : '+'}</span>
              </button>
              {faq === i && <div className="bg-white px-5 pb-5 text-gray-600 text-sm rounded-b-xl -mt-2 pt-2">{f.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-brand-600 text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-black mb-4">Empieza hoy. Gratis.</h2>
          <p className="text-brand-100 mb-8 text-lg">7 días de prueba gratuita. Sin tarjeta. Acceso completo.</p>
          <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input
              type="email"
              placeholder="tu@inmobiliaria.com"
              value={email}
              onChange={e => { setEmail(e.target.value); setEmailError('') }}
              className={`flex-1 bg-white/20 border rounded-xl px-5 py-4 text-white placeholder-white/60 focus:border-white outline-none ${emailError ? 'border-red-400' : 'border-white/30'}`}
            />
            <button
              onClick={() => handleTrial('bottom_cta')}
              disabled={loading || !email}
              className="bg-white text-brand-700 font-black px-8 py-4 rounded-xl hover:bg-gray-100 transition whitespace-nowrap shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Enviando...' : 'Empezar Gratis'}
            </button>
          </div>
          {emailError && <p className="text-red-300 text-sm mt-3">{emailError}</p>}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-dark-900 text-gray-500 py-10">
        <div className="max-w-5xl mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-brand-600 rounded flex items-center justify-center text-white font-black text-xs">P</div>
              <span className="font-bold text-white">PropData.es</span>
            </div>
            <div className="flex gap-6 text-xs">
              <a href="mailto:inmobancamurcia@gmail.com" className="hover:text-white transition">inmobancamurcia@gmail.com</a>
              <a href="tel:+34620300647" className="hover:text-white transition">+34 620 300 647</a>
            </div>
          </div>
          <div className="text-center text-xs mt-6 text-gray-600">
            SECRETIUM GROUP | NIF: 15480314A | Molina de Segura, Murcia
          </div>
        </div>
      </footer>
    </div>
  )
}

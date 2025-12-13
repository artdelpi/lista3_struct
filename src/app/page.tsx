export default function Home() {
  const events = [
    { slug: "final-brasileirao", title: "Final do Brasileirão", tag: "Futebol", teams: ["Flamengo", "Palmeiras"] },
    { slug: "classico-nacional", title: "Clássico Nacional", tag: "Futebol", teams: ["Corinthians", "São Paulo"] },
    { slug: "basquete-jogo-7", title: "NBA Finals - Game 7", tag: "Basquete", teams: ["Lakers", "Celtics"] },
    { slug: "csgo-grand-final", title: "CS:GO Major Final", tag: "eSports", teams: ["Team A", "Team B"] },
  ];

  const features = [
    { 
      icon: "⚡", 
      title: "Odds em Tempo Real", 
      description: "Atualizações instantâneas das melhores odds do mercado" 
    },
    { 
      icon: "🛡️", 
      title: "Segurança Garantida", 
      description: "Transações protegidas com criptografia de ponta" 
    },
    { 
      icon: "💸", 
      title: "Pagamentos Rápidos", 
      description: "Saques processados em até 2 horas" 
    },
  ];

  return (
    <section className="py-14 sm:py-20 space-y-20">
      {/* HERO SECTION */}
      <header className="text-center space-y-8 max-w-4xl mx-auto px-4">
        <div className="space-y-4">
          <h1 className="text-5xl sm:text-7xl font-bold tracking-tight bg-gradient-to-r from-white to-fuchsia-200 bg-clip-text text-transparent">
            Bet<span className="text-fuchsia-400">Comp</span>
          </h1>
          <p className="text-xl sm:text-2xl text-zinc-300 leading-relaxed">
            A plataforma definitiva para{" "}
            <span className="text-fuchsia-400 font-semibold">apostas esportivas</span>{" "}
            com as melhores odds e experiência premium
          </p>
        </div>
        
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row pt-4">
          <button className="rounded-2xl bg-gradient-to-r from-fuchsia-500 to-purple-600 px-8 py-4 font-bold text-white hover:from-fuchsia-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-fuchsia-500/25">
            Começar a Apostar
          </button>
          <button className="rounded-2xl border-2 border-zinc-600 px-8 py-4 font-semibold hover:border-fuchsia-400 hover:text-fuchsia-400 transition-all duration-200">
            Ver Demonstração
          </button>
        </div>
      </header>


      {/* FEATURES GRID */}
      <section className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group p-6 rounded-2xl border border-zinc-800 bg-zinc-900/50 hover:border-fuchsia-500/50 transition-all duration-300 hover:transform hover:scale-105"
            >
              <div className="text-3xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-fuchsia-400 transition-colors">
                {feature.title}
              </h3>
              <p className="text-zinc-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* EVENTOS EM DESTAQUE */}
      <section className="max-w-6xl mx-auto px-4 space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-3xl sm:text-4xl font-bold">
            Eventos em <span className="text-fuchsia-400">Destaque</span>
          </h2>
          <p className="text-xl text-zinc-400">
            Partidas quentes com as melhores oportunidades
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {events.map((event) => (
            <div
              key={event.slug}
              className="group rounded-2xl border border-zinc-800 bg-zinc-900/30 p-6 transition-all duration-300 hover:border-fuchsia-500/50 hover:bg-zinc-900/50 hover:transform hover:scale-105 cursor-pointer"
            >
              {/* Event Header */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="rounded-full bg-fuchsia-500/10 px-3 py-1 text-xs font-medium text-fuchsia-400 border border-fuchsia-500/20">
                    {event.tag}
                  </span>
                  <div className="text-xs text-zinc-500">AO VIVO</div>
                </div>
                
                <h3 className="font-bold text-lg group-hover:text-fuchsia-300 transition-colors mb-3">
                  {event.title}
                </h3>
                
                {/* Teams */}
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between items-center">
                    <span>{event.teams[0]}</span>
                    <span className="font-bold text-fuchsia-400">1.90</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>{event.teams[1]}</span>
                    <span className="font-bold text-fuchsia-400">2.05</span>
                  </div>
                </div>
              </div>

              {/* Odds */}
              <div className="flex gap-2 pt-4 border-t border-zinc-800">
                <span className="flex-1 text-center rounded-lg bg-zinc-800 py-2 text-sm font-medium hover:bg-fuchsia-500 hover:text-white transition-colors">
                  1
                </span>
                <span className="flex-1 text-center rounded-lg bg-zinc-800 py-2 text-sm font-medium hover:bg-fuchsia-500 hover:text-white transition-colors">
                  X
                </span>
                <span className="flex-1 text-center rounded-lg bg-zinc-800 py-2 text-sm font-medium hover:bg-fuchsia-500 hover:text-white transition-colors">
                  2
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-8">
          <button className="inline-flex items-center gap-2 rounded-2xl border-2 border-zinc-700 px-8 py-4 font-semibold hover:border-fuchsia-400 hover:text-fuchsia-400 transition-all duration-200 group">
            Explorar Todos os Eventos
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <div className="rounded-3xl bg-gradient-to-r from-zinc-900 to-zinc-800 border border-zinc-700 p-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Pronto para <span className="text-fuchsia-400">começar</span>?
          </h2>
          <p className="text-xl text-zinc-300 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de apostadores que já descobriram a melhor forma de apostar
          </p>
          <button className="rounded-2xl bg-gradient-to-r from-fuchsia-500 to-purple-600 px-10 py-4 font-bold text-white hover:from-fuchsia-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg shadow-fuchsia-500/25">
            Criar Conta Gratuita
          </button>
        </div>
      </section>
    </section>
  );
}
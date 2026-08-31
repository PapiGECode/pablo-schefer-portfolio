import { Code2, Layers, FileText, Zap, Bot, Globe } from "lucide-react";

export default function IntroductionPage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[60vh] px-4 sm:px-6 pt-28 sm:pt-32 pb-16 sm:pb-20">
        <div className="mx-auto max-w-4xl">
          <div className="space-y-6 sm:space-y-8">
            <div className="space-y-2">
              <p className="font-mono text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-muted-foreground">
                Pablo Schefer Orduña · PapiGECode
              </p>
              <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl text-balance">
                Donde la comunidad encuentra{" "}
                <span className="bg-gradient-to-l from-primary/50 to-accent text-transparent bg-clip-text">
                  código
                </span>
              </h1>
            </div>

            <p className="text-base sm:text-lg leading-relaxed text-muted-foreground max-w-3xl">
              Soy Pablo Schefer Orduña, PapiGEGamer en Discord. PapiGECode es mi laboratorio digital:
              un espacio para reunir mi experiencia en comunidades, moderación, vibecoding y proyectos
              digitales construidos con intención.
            </p>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="relative px-4 sm:px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <div className="rounded border border-border/50 bg-card/50 p-6 sm:p-10 backdrop-blur-sm space-y-8">
            <div className="space-y-4">
              <p className="font-mono text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary">
                Sobre Pablo
              </p>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
                Comunidad primero. Código con intención.
              </h2>
            </div>

            <div className="space-y-6 text-base sm:text-lg leading-relaxed text-muted-foreground">
              <p>
                Mi recorrido digital empezó en Discord, donde he aprendido a coordinar personas,
                cuidar comunidades y convertir problemas cotidianos en soluciones. Este espacio
                muestra ese recorrido en movimiento.
              </p>

              <p>
                Actualmente modero comunidades como FNLB, Nate Gentile, Edgar Pons y Thiago
                Community. También colaboro en proyectos como KernelOS y desarrollo herramientas
                web con React y TypeScript, apoyándome en IA cuando aporta valor.
              </p>

              <p>
                La idea es sencilla: escuchar, ordenar, construir y dar continuidad. Cada proyecto,
                nota y experimento forma parte de una forma de trabajar centrada en las personas
                que van a usar lo que creo.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="relative px-4 sm:px-6 py-16 sm:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="mb-12 space-y-4 text-center">
            <p className="font-mono text-xs uppercase tracking-[0.2em] sm:tracking-[0.3em] text-primary">
              Ámbitos de trabajo
            </p>
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Comunidad, producto y código
            </h2>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: Code2,
                title: "Proyectos digitales",
                description:
                  "Ideas convertidas en experiencias web y herramientas útiles para personas y comunidades reales.",
              },
              {
                icon: Layers,
                title: "Moderación y operaciones",
                description:
                  "Sistemas claros, documentación y coordinación para que las comunidades puedan crecer con contexto.",
              },
              {
                icon: FileText,
                title: "Vibecoding",
                description:
                  "Desarrollo con React y TypeScript, usando IA para prototipar y avanzar sin perder el control técnico.",
              },
              {
                icon: Zap,
                title: "Colaboración abierta",
                description:
                  "Trabajo entre producto, soporte y comunidad para que las ideas lleguen a usuarios reales.",
              },
              {
                icon: Bot,
                title: "Comunidades en Discord",
                description:
                  "Experiencia moderando comunidades de tecnología, gaming y creadores desde 2015.",
              },
              {
                icon: Globe,
                title: "Presencia digital",
                description:
                  "Un punto de encuentro para conocer mi trabajo, mis proyectos y mi forma de colaborar.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="group rounded border border-border/50 bg-card/50 p-6 backdrop-blur-sm transition-all duration-300 hover:border-primary/50 hover:bg-card/80"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded border border-primary/30 bg-primary/10 text-primary transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 font-mono text-sm font-semibold uppercase tracking-wider text-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

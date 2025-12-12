"use client";

import { Lightbulb, TrendingUp } from "lucide-react";

const HeroAbout = () => {
  return (
    <div>
      {/* Section Héro */}
      <section className="pt-32 pb-16 md:pt-40 md:pb-24 px-4 sm:px-6 lg:px-8 bg-linear-to-b from-white via-blue-50/30 to-transparent">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight mb-6">
            Connecter les Étudiants à{" "}
            <span className="bg-linear-to-r from-[#009ee2] to-[#00567a] bg-clip-text text-transparent">
              Leur Avenir
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Student Connect est plus qu&apos;un simple tableau d&apos;offres
            d&apos;emploi. Nous sommes un pont entre l&apos;ambition et
            l&apos;opportunité, mettant en relation les étudiants et diplômés
            talentueux avec des rôles qui correspondent à leurs rêves.
          </p>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Mission */}
            <div className="bg-linear-to-br from-primary/5 to-secondary/5 rounded-2xl p-8 md:p-10 border border-border">
              <div className="w-12 h-12 linear-premiere rounded-lg flex items-center justify-center mb-6">
                <Lightbulb className="w-6 h-6 text-white" /> {/* Ampoule */}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Notre Mission
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Donner aux étudiants et aux jeunes diplômés un accès intelligent
                et personnalisé à des opportunités de carrière qui correspondent
                à leurs compétences, intérêts et aspirations uniques.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Nous croyons que chacun mérite une chance équitable de découvrir
                des postes où il peut s&apos;épanouir et grandir.
              </p>
            </div>

            {/* Vision */}
            <div className="bg-linear-to-br from-secondary/5 to-primary/5 rounded-2xl p-8 md:p-10 border border-border">
              <div className="w-12 h-12 linear-premiere rounded-lg flex items-center justify-center mb-6">
                <TrendingUp className="w-6 h-6 text-white" />{" "}
                {/* Tendance à la hausse */}
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Notre Vision
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Un monde où chaque étudiant peut facilement découvrir et obtenir
                des opportunités qui lancent sa carrière, et où les entreprises
                trouvent les talents dont elles ont besoin pour se développer.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Nous construisons l&apos;avenir de la découverte de talents, une
                connexion à la fois.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HeroAbout;

import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid h-screen place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8 relative">
      <div className="text-center">
        <Image
          src={"/images/connect-student-logo.png"}
          alt="Connect Student"
          width={500}
          height={500}
          className="w-56 mx-auto py-6"
        />
        <p className="text-2xl font-semibold text-premiere">404</p>
        <h1 className="mt-4 text-5xl font-semibold tracking-tight text-balance text-gray-900 sm:text-7xl">
          Page introuvable
        </h1>
        <p className="mt-6 text-lg font-medium text-pretty text-gray-500 sm:text-xl/8">
          Désolé, nous n’avons pas trouvé la page que vous recherchez.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <Link
            href="/"
            className="rounded-md bg-premiere px-3.5 py-2.5 text-sm font-semibold text-white shadow-xs focus-visible:outline-2 focus-visible:outline-offset-2">
            {"Retourner à l'accueil"}
          </Link>
          <Link
            target="_blank"
            href="mailto:contact@connect-student.com"
            className="text-sm font-semibold text-gray-900">
            Contactez le support <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

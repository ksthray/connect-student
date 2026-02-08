import { Suspense } from "react";
import SearchPage from "./components/search-page";


export default function Page() {
    return (
        <main className="">
            <Suspense fallback={<div>Chargement...</div>}>
                <SearchPage />
            </Suspense>
        </main>
    );
}

import { Container } from "@/components/ui/Container";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacidade",
  description: "Como tratamos os teus dados em Conectamente.",
};

export default function PrivacidadePage() {
  return (
    <Container className="py-12 md:py-20 max-w-3xl">
      <p className="text-sm text-muted">Privacidade</p>
      <h1 className="heading-display text-4xl md:text-5xl mt-3">O que fazemos com os teus dados</h1>
      <div className="prose-soft mt-8 space-y-5">
        <p>Resposta curta: <strong>o mínimo possível</strong>. Versão longa abaixo.</p>
        <h2 className="heading-display text-xl text-ink mt-8">Sem conta</h2>
        <p>
          Se usares Conectamente sem criar conta, todos os teus dados (reflexões,
          intenções, check-ins, exercícios) ficam <strong>apenas no teu navegador</strong>,
          em <code>localStorage</code>. Não os recebemos. Apagar o histórico do
          browser apaga-os.
        </p>
        <h2 className="heading-display text-xl text-ink mt-8">Com conta</h2>
        <p>
          Se criares conta, usamos um servidor para sincronizar entre dispositivos.
          Guardamos: email (para login), e o conteúdo dos exercícios cifrado em
          repouso. Não vendemos nem partilhamos. Podes pedir eliminação total
          escrevendo a <a className="underline" href="mailto:apoio@conectamente.pt">apoio@conectamente.pt</a>.
        </p>
        <h2 className="heading-display text-xl text-ink mt-8">Cookies</h2>
        <p>
          Não usamos cookies de tracking nem analítica de terceiros. O único
          armazenamento local é o estritamente necessário para a aplicação funcionar
          (preferência de tema e dados acima descritos).
        </p>
        <h2 className="heading-display text-xl text-ink mt-8">Anúncios</h2>
        <p>Não. Não há e não vai haver anúncios.</p>
      </div>
    </Container>
  );
}

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Locale;

/**
 * Demonstração do catálogo do TomCerto: monta uma lista de produtos de
 * formatos diferentes (herdeiros de Produto), calcula o percentual de
 * compatibilidade de cada um com um perfil desejado e imprime o
 * ranking do mais compatível para o menos compatível.
 *
 * Pilar de POO: POLIMORFISMO. O laço abaixo percorre a lista através do
 * tipo Produto e chama produto.calcularCompatibilidade(perfil) sem
 * nenhum instanceof/checagem de tipo: em tempo de execução, a JVM
 * decide sozinha se quem responde é BaseLiquida, BaseCushion ou
 * BaseMousse, de acordo com o tipo real de cada objeto.
 */
public class Main {

    public static void main(String[] args) {
        List<Produto> catalogo = new ArrayList<>();

        catalogo.add(new BaseLiquida(
                "Boticário", "Make B. Belíssima Matte", 79.90, "310",
                Subtom.QUENTE, Acabamento.MATTE, 15));

        catalogo.add(new BaseCushion(
                "Eudora", "Cushion Glow", 89.90, "40",
                Subtom.NEUTRO, Acabamento.LUMINOSO, 2));

        catalogo.add(new BaseMousse(
                "Vult", "Mousse Fiel", 39.90, "05",
                Subtom.QUENTE, Acabamento.NATURAL, 60.0));

        catalogo.add(new BaseLiquida(
                "Quem disse Berenice", "Base Perfeita", 69.90, "NC30",
                Subtom.OLIVA, Acabamento.ACETINADO, 30));

        catalogo.add(new BaseCushion(
                "Boticário", "Cushion Glow B.", 99.90, "220",
                Subtom.QUENTE, Acabamento.LUMINOSO, 1));

        catalogo.add(new BaseMousse(
                "Eudora", "My Skin Mousse", 54.90, "FRIO 10",
                Subtom.FRIO, Acabamento.LUMINOSO, 45.5));

        PerfilDesejado perfilDesejado = new PerfilDesejado(Subtom.QUENTE, Acabamento.LUMINOSO);

        List<Produto> ranking = new ArrayList<>(catalogo);
        ranking.sort(Comparator.comparingDouble(
                (Produto produto) -> produto.calcularCompatibilidade(perfilDesejado)).reversed());

        System.out.println("=== TomCerto — ranking de compatibilidade ===");
        System.out.printf(Locale.forLanguageTag("pt-BR"),
                "Perfil desejado: subtom %s, acabamento %s%n%n",
                perfilDesejado.getSubtom(), perfilDesejado.getAcabamento());

        for (Produto produto : ranking) {
            double percentual = produto.calcularCompatibilidade(perfilDesejado);
            System.out.printf(Locale.forLanguageTag("pt-BR"),
                    "%-22s %-26s tom %-8s -> %5.1f%% de compatibilidade%n",
                    produto.getMarca(), produto.getNome(), produto.getTom(), percentual);
        }
    }
}

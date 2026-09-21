/**
 * Test runner caseiro para o domínio do TomCerto, sem depender de
 * nenhum framework de testes (o ambiente de entrega não tem
 * Maven/Gradle configurado, então não há como trazer JUnit).
 *
 * Uso: javac *.java && java TesteBases
 */
public class TesteBases {

    private static int passaram = 0;
    private static int falharam = 0;

    /**
     * Substitui java.util.function.Executable (que não existe fora do
     * JUnit): um bloco de código que pode lançar qualquer exceção,
     * usado por assertThrows.
     */
    @FunctionalInterface
    private interface Executavel {
        void executar() throws Throwable;
    }

    public static void main(String[] args) {

        // ---- Subtom / posição na escala -----------------------------------
        assertEquals("Subtom.QUENTE.getPosicao() == 3", 3, Subtom.QUENTE.getPosicao());
        assertEquals("Subtom.OLIVA.getPosicao() == 2 (categoria própria, não variação de NEUTRO)",
                2, Subtom.OLIVA.getPosicao());

        // ---- Cálculo de compatibilidade por subclasse ----------------------
        // Perfil desejado usado em todos os casos abaixo: QUENTE / LUMINOSO.
        PerfilDesejado perfil = new PerfilDesejado(Subtom.QUENTE, Acabamento.LUMINOSO);

        // BaseLiquida: subtom QUENTE (distância 0 -> scoreBase 100),
        // acabamento MATTE != LUMINOSO -> penalidade 5 -> 95.0
        BaseLiquida liquida = new BaseLiquida(
                "Boticário", "Make B. Belíssima Matte", 79.90, "310",
                Subtom.QUENTE, Acabamento.MATTE, 15);
        assertEquals("BaseLiquida: subtom igual + acabamento diferente -> 95.0",
                95.0, liquida.calcularCompatibilidade(perfil));

        // BaseCushion: subtom NEUTRO (distância 2 -> scoreBase 33.333...),
        // acabamento LUMINOSO == LUMINOSO -> penalidade 0 -> 33.3
        BaseCushion cushion = new BaseCushion(
                "Eudora", "Cushion Glow", 89.90, "40",
                Subtom.NEUTRO, Acabamento.LUMINOSO, 2);
        assertEquals("BaseCushion: subtom NEUTRO (distância 2) + acabamento igual -> 33.3",
                33.3, cushion.calcularCompatibilidade(perfil));

        // BaseMousse: subtom QUENTE (distância 0 -> scoreBase 100),
        // acabamento NATURAL != LUMINOSO -> penalidade 10 -> 90.0
        BaseMousse mousse = new BaseMousse(
                "Vult", "Mousse Fiel", 39.90, "05",
                Subtom.QUENTE, Acabamento.NATURAL, 60.0);
        assertEquals("BaseMousse: subtom igual + acabamento diferente -> 90.0",
                90.0, mousse.calcularCompatibilidade(perfil));

        // BaseLiquida com subtom OLIVA (distância 1 -> scoreBase 66.666...67),
        // acabamento ACETINADO != LUMINOSO -> penalidade 5 -> 61.7
        BaseLiquida liquidaOliva = new BaseLiquida(
                "Quem disse Berenice", "Base Perfeita", 69.90, "NC30",
                Subtom.OLIVA, Acabamento.ACETINADO, 30);
        assertEquals("BaseLiquida: subtom OLIVA (distância 1) + acabamento diferente -> 61.7",
                61.7, liquidaOliva.calcularCompatibilidade(perfil));

        // ---- Encapsulamento: setters validam e lançam exceção -------------
        assertThrows("Produto.setPreco(-1) lança IllegalArgumentException",
                IllegalArgumentException.class, () -> liquida.setPreco(-1));

        assertThrows("BaseLiquida.setFps(-1) lança IllegalArgumentException",
                IllegalArgumentException.class, () -> liquida.setFps(-1));

        assertThrows("BaseCushion.setNumeroEsponjas(0) lança IllegalArgumentException",
                IllegalArgumentException.class, () -> cushion.setNumeroEsponjas(0));

        assertThrows("BaseCushion.setNumeroEsponjas(-3) lança IllegalArgumentException",
                IllegalArgumentException.class, () -> cushion.setNumeroEsponjas(-3));

        assertThrows("BaseMousse.setPercentualAeracao(-1) lança IllegalArgumentException",
                IllegalArgumentException.class, () -> mousse.setPercentualAeracao(-1));

        assertThrows("BaseMousse.setPercentualAeracao(101) lança IllegalArgumentException",
                IllegalArgumentException.class, () -> mousse.setPercentualAeracao(101));

        // ---- Polimorfismo real: mesma "distância" de subtom (0) e mesmo ---
        // "erro" de acabamento (MATTE quando o perfil pede LUMINOSO), mas
        // subclasses diferentes aplicam pesos de penalidade diferentes e
        // por isso devolvem percentuais finais diferentes.
        BaseLiquida liquidaComparacao = new BaseLiquida(
                "Boticário", "Base Comparação", 50.0, "300",
                Subtom.QUENTE, Acabamento.MATTE, 20);
        BaseCushion cushionComparacao = new BaseCushion(
                "Boticário", "Cushion Comparação", 50.0, "300",
                Subtom.QUENTE, Acabamento.MATTE, 2);

        double percentualLiquida = liquidaComparacao.calcularCompatibilidade(perfil);
        double percentualCushion = cushionComparacao.calcularCompatibilidade(perfil);

        assertEquals("Polimorfismo: BaseLiquida com penalidade de acabamento -> 95.0",
                95.0, percentualLiquida);
        assertEquals("Polimorfismo: BaseCushion com penalidade de acabamento -> 85.0",
                85.0, percentualCushion);
        assertTrue("Polimorfismo: mesmo perfil e mesmo 'erro' de acabamento, "
                        + "subclasses diferentes produzem percentuais diferentes",
                percentualLiquida != percentualCushion);

        // ---- Resumo ---------------------------------------------------------
        System.out.println();
        System.out.println(passaram + " passaram, " + falharam + " falharam");
        if (falharam > 0) {
            System.exit(1);
        }
    }

    private static void assertEquals(String descricao, double esperado, double obtido) {
        // Comparação com tolerância pequena por causa de ponto flutuante;
        // os valores já vêm arredondados a 1 casa decimal pelo próprio
        // método testado.
        if (Math.abs(esperado - obtido) < 0.0001) {
            passaram++;
            System.out.println("PASS: " + descricao);
        } else {
            falharam++;
            System.out.println("FAIL: " + descricao + " — esperado " + esperado + ", obtido " + obtido);
        }
    }

    private static void assertTrue(String descricao, boolean condicao) {
        if (condicao) {
            passaram++;
            System.out.println("PASS: " + descricao);
        } else {
            falharam++;
            System.out.println("FAIL: " + descricao + " — esperado true, obtido false");
        }
    }

    private static void assertThrows(String descricao, Class<? extends Throwable> tipoEsperado,
                                      Executavel executavel) {
        try {
            executavel.executar();
            falharam++;
            System.out.println("FAIL: " + descricao + " — esperado " + tipoEsperado.getSimpleName()
                    + ", nenhuma exceção foi lançada");
        } catch (Throwable t) {
            if (tipoEsperado.isInstance(t)) {
                passaram++;
                System.out.println("PASS: " + descricao);
            } else {
                falharam++;
                System.out.println("FAIL: " + descricao + " — esperado " + tipoEsperado.getSimpleName()
                        + ", obtido " + t.getClass().getSimpleName());
            }
        }
    }
}

/**
 * Subtom de pele. Cada constante carrega a posição na escala usada no
 * cálculo de compatibilidade (distância entre subtons). OLIVA é uma
 * categoria própria, não uma variação de NEUTRO.
 */
public enum Subtom {
    FRIO(0),
    NEUTRO(1),
    OLIVA(2),
    QUENTE(3);

    private final int posicao;

    Subtom(int posicao) {
        this.posicao = posicao;
    }

    public int getPosicao() {
        return posicao;
    }
}

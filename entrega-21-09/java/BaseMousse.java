/**
 * Base mousse: textura aerada, batida para incorporar ar e ficar mais
 * leve na pele.
 *
 * Pilar de POO: HERANÇA. Estende Produto e acrescenta apenas o
 * percentual de aeração da fórmula, que é a característica que
 * diferencia este formato dos demais.
 */
public class BaseMousse extends Produto {

    private static final double PESO_PENALIDADE_ACABAMENTO = 10.0;

    private double percentualAeracao;

    public BaseMousse(String marca, String nome, double preco, String tom,
                       Subtom subtom, Acabamento acabamento, double percentualAeracao) {
        super(marca, nome, preco, tom, subtom, acabamento);
        setPercentualAeracao(percentualAeracao);
    }

    public double getPercentualAeracao() {
        return percentualAeracao;
    }

    public void setPercentualAeracao(double percentualAeracao) {
        if (percentualAeracao < 0 || percentualAeracao > 100) {
            throw new IllegalArgumentException(
                    "Percentual de aeração deve estar entre 0 e 100: " + percentualAeracao);
        }
        this.percentualAeracao = percentualAeracao;
    }

    @Override
    public double calcularCompatibilidade(PerfilDesejado perfilDesejado) {
        double scoreBase = calcularScoreBase(perfilDesejado);
        double penalidade = (getAcabamento() == perfilDesejado.getAcabamento())
                ? 0.0
                : PESO_PENALIDADE_ACABAMENTO;
        double scoreFinal = Math.max(0.0, scoreBase - penalidade);
        return Math.round(scoreFinal * 10.0) / 10.0;
    }
}

/**
 * Base cushion: vem em estojo compacto, com esponja embebida em produto
 * líquido e reposições vendidas separadamente (refis).
 *
 * Pilar de POO: HERANÇA. Estende Produto e reaproveita toda a estrutura
 * comum, acrescentando apenas o número de esponjas que acompanham o
 * estojo.
 */
public class BaseCushion extends Produto {

    private static final double PESO_PENALIDADE_ACABAMENTO = 15.0;

    private int numeroEsponjas;

    public BaseCushion(String marca, String nome, double preco, String tom,
                        Subtom subtom, Acabamento acabamento, int numeroEsponjas) {
        super(marca, nome, preco, tom, subtom, acabamento);
        setNumeroEsponjas(numeroEsponjas);
    }

    public int getNumeroEsponjas() {
        return numeroEsponjas;
    }

    public void setNumeroEsponjas(int numeroEsponjas) {
        if (numeroEsponjas <= 0) {
            throw new IllegalArgumentException("Número de esponjas deve ser maior que zero: " + numeroEsponjas);
        }
        this.numeroEsponjas = numeroEsponjas;
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

/**
 * Base de maquiagem líquida tradicional, vendida em frasco com conta-gotas
 * ou válvula pump.
 *
 * Pilar de POO: HERANÇA. Estende Produto e reaproveita marca, nome,
 * preço, tom, subtom, acabamento e o método calcularScoreBase, somando
 * apenas o que é específico deste formato: o fator de proteção solar.
 */
public class BaseLiquida extends Produto {

    private static final double PESO_PENALIDADE_ACABAMENTO = 5.0;

    private int fps;

    public BaseLiquida(String marca, String nome, double preco, String tom,
                        Subtom subtom, Acabamento acabamento, int fps) {
        super(marca, nome, preco, tom, subtom, acabamento);
        setFps(fps);
    }

    public int getFps() {
        return fps;
    }

    public void setFps(int fps) {
        if (fps < 0) {
            throw new IllegalArgumentException("FPS não pode ser negativo: " + fps);
        }
        this.fps = fps;
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

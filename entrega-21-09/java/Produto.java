/**
 * Representa, de forma abstrata, uma base de maquiagem cadastrada no
 * TomCerto. Concentra os dados comuns a qualquer tipo de base (marca,
 * nome, preço, tom, subtom, acabamento) e o núcleo do cálculo de
 * compatibilidade, mas deixa a cada subclasse a responsabilidade de
 * decidir exatamente como transformar esse núcleo em um percentual
 * final — cada formato de base tem suas próprias particularidades.
 *
 * Pilar de POO: ABSTRAÇÃO. Não faz sentido instanciar um "Produto"
 * genérico: só existem bases líquidas, cushion, mousse etc. Por isso a
 * classe é abstrata e o método calcularCompatibilidade também é
 * abstrato — cada subclasse concreta é obrigada a fornecer sua própria
 * implementação.
 *
 * Pilar de POO: ENCAPSULAMENTO. Todos os atributos são privados e só
 * podem ser lidos/alterados através de getters/setters, que também
 * garantem invariantes (ex.: preço não pode ser negativo).
 */
public abstract class Produto {

    private String marca;
    private String nome;
    private double preco;
    private String tom;
    private Subtom subtom;
    private Acabamento acabamento;

    protected Produto(String marca, String nome, double preco, String tom,
                       Subtom subtom, Acabamento acabamento) {
        this.marca = marca;
        this.nome = nome;
        setPreco(preco);
        this.tom = tom;
        this.subtom = subtom;
        this.acabamento = acabamento;
    }

    public String getMarca() {
        return marca;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public double getPreco() {
        return preco;
    }

    public void setPreco(double preco) {
        if (preco < 0) {
            throw new IllegalArgumentException("Preço não pode ser negativo: " + preco);
        }
        this.preco = preco;
    }

    public String getTom() {
        return tom;
    }

    public void setTom(String tom) {
        this.tom = tom;
    }

    public Subtom getSubtom() {
        return subtom;
    }

    public void setSubtom(Subtom subtom) {
        this.subtom = subtom;
    }

    public Acabamento getAcabamento() {
        return acabamento;
    }

    public void setAcabamento(Acabamento acabamento) {
        this.acabamento = acabamento;
    }

    /**
     * Calcula o percentual de compatibilidade (0 a 100, arredondado a 1
     * casa decimal) entre este produto e o perfil desejado pelo usuário.
     * Cada subclasse define sua própria penalidade sobre o score base,
     * de acordo com as particularidades do seu formato.
     *
     * Pilar de POO: POLIMORFISMO. O mesmo método, chamado através da
     * referência Produto, executa um corpo diferente conforme o tipo
     * concreto do objeto em tempo de execução.
     */
    public abstract double calcularCompatibilidade(PerfilDesejado perfilDesejado);

    /**
     * Núcleo do cálculo de compatibilidade, comum a todas as subclasses:
     * mede o quão distante o subtom do produto está do subtom desejado
     * na escala de 0 a 3 e converte essa distância em um score de 0 a
     * 100. Reaproveitado (não sobrescrito) por todas as subclasses, que
     * apenas aplicam sua própria penalidade específica em cima dele.
     */
    protected double calcularScoreBase(PerfilDesejado perfilDesejado) {
        int distanciaSubtom = Math.abs(this.subtom.getPosicao() - perfilDesejado.getSubtom().getPosicao());
        return 100.0 * (1 - distanciaSubtom / 3.0);
    }
}

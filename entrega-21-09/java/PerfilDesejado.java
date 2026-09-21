/**
 * Representa o perfil de compatibilidade que o usuário do TomCerto está
 * buscando: um subtom de pele e um acabamento preferido.
 *
 * Classe imutável: os campos são finais e só podem ser lidos, nunca
 * alterados após a construção.
 */
public final class PerfilDesejado {

    private final Subtom subtom;
    private final Acabamento acabamento;

    public PerfilDesejado(Subtom subtom, Acabamento acabamento) {
        this.subtom = subtom;
        this.acabamento = acabamento;
    }

    public Subtom getSubtom() {
        return subtom;
    }

    public Acabamento getAcabamento() {
        return acabamento;
    }
}

export declare class Permissoes {
    /**
     * Verifica se o usuário atual pode cadastrar pacientes
     * Apenas médico e psicólogo podem cadastrar
     */
    static podeCadastrarPaciente(): boolean;
    /**
     * Verifica se o usuário atual pode criar avaliações
     * Apenas médico e psicólogo podem criar avaliações
     */
    static podeCriarAvaliacao(): boolean;
    /**
     * Verifica se o usuário atual pode acessar a página de pacientes
     * Assistente não pode acessar
     */
    static podeAcessarPacientes(): boolean;
    /**
     * Verifica se o usuário atual pode acessar a página de avaliações
     * Assistente não pode acessar
     */
    static podeAcessarAvaliacoes(): boolean;
    /**
     * Verifica se o usuário atual pode editar/excluir pacientes
     * Apenas admin, médico e psicólogo podem
     */
    static podeEditarPaciente(): boolean;
    /**
     * Verifica se o usuário atual pode editar/excluir avaliações
     * Apenas admin, médico e psicólogo podem
     */
    static podeEditarAvaliacao(): boolean;
    /**
     * Verifica se o usuário atual é admin
     */
    static isAdmin(): boolean;
    /**
     * Verifica se o usuário atual é assistente
     */
    static isAssistente(): boolean;
}
//# sourceMappingURL=Permissoes.d.ts.map
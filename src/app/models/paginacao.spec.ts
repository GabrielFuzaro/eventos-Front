import { OPCOES_TAMANHO_PAGINA, calcularPaginasVisiveis } from './paginacao';

describe('Paginação CODIUB', () => {
  it('deve disponibilizar as opções padrão de 5, 10 e 20 itens por página', () => {
    expect(OPCOES_TAMANHO_PAGINA).toEqual([5, 10, 20]);
  });

  it('deve calcular corretamente a janela deslizante de páginas visíveis', () => {
    expect(calcularPaginasVisiveis(0, 0)).toEqual([]);
    expect(calcularPaginasVisiveis(0, 3)).toEqual([0, 1, 2]);
    expect(calcularPaginasVisiveis(0, 10, 5)).toEqual([0, 1, 2, 3, 4]);
    expect(calcularPaginasVisiveis(5, 10, 5)).toEqual([3, 4, 5, 6, 7]);
    expect(calcularPaginasVisiveis(9, 10, 5)).toEqual([5, 6, 7, 8, 9]);
  });
});

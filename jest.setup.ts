import nock from 'nock';

// Limpa todos os nocks após cada teste
afterEach(() => {
  nock.cleanAll();
});

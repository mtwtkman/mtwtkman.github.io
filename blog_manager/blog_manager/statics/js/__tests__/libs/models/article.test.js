import Model from 'libs/models/article';

jest.mock('libs/request');

describe('ArticleModel', () => {
  test('fetches a data', () => {
    const model = new Model();
    model.fetch().then(() => {
      expect(model.data).toEqual({body: 'test'});
    });
  });
  test('creates a data', () => {
    const data = {hoge: 'fuga'};
    const model = new Model(data)
    model.create().then(() => {
      expect(model.data).toEqual(data);
    });
  });
  test('updates a data', () => {
    const data = {update: 'year'};
    const model = new Model();
    model.data = data;
    model.update().then(() => {
      expect(model.data).toEqual(data);
    });
  });
  test('deletes a data', () => {
    const model = new Model();
    model.delete().then(() => {
      expect(model.data).toBeNull();
    });
  });
});

import { LoadSurveyRepository } from './db-load-surveys-protocols'
import { DbLoadSurveys } from './db-load-surveys'
import { mockSurveys, throwError } from '@/domain/test'
import MockDate from 'mockdate'
import { mockLoadSurveysRepository } from '@/data/test'

interface SutTypes {
  sut: DbLoadSurveys
  loadSurveyRepositoryStub: LoadSurveyRepository
}

const makeSut = (): SutTypes => {
  const loadSurveyRepositoryStub = mockLoadSurveysRepository()
  const sut = new DbLoadSurveys(loadSurveyRepositoryStub)
  return {
    sut, loadSurveyRepositoryStub
  }
}

const accountId = 'any_account_id'

describe('DbLoadSurveys', () => {
  beforeAll(() => {
    MockDate.set(new Date())
  })

  afterAll(() => {
    MockDate.reset()
  })

  test('Should call LoadSurveysRepository', async () => {
    const { sut, loadSurveyRepositoryStub } = makeSut()
    const loadAllSpy = jest.spyOn(loadSurveyRepositoryStub, 'loadAll')
    await sut.load(accountId)
    expect(loadAllSpy).toHaveBeenCalledWith('any_account_id')
  })

  test('Should return a list of Surveys on success', async () => {
    const { sut } = makeSut()
    const surveys = await sut.load(accountId)
    expect(surveys).toEqual(mockSurveys())
  })

  test('Should throw if LoadSurveysRepository throws', async () => {
    const { sut, loadSurveyRepositoryStub } = makeSut()
    jest.spyOn(loadSurveyRepositoryStub, 'loadAll').mockImplementationOnce(throwError)
    const promise = sut.load(accountId)
    await expect(promise).rejects.toThrow()
  })
})

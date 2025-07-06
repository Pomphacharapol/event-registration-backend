import { Test, TestingModule } from '@nestjs/testing';
import { AutoIdService } from '../auto-id.service';

describe('AutoIdService', () => {
  let service: AutoIdService;

  beforeEach(async () => {
    const testingModule: TestingModule = await Test.createTestingModule({
      providers: [AutoIdService],
    }).compile();

    service = testingModule.get<AutoIdService>(AutoIdService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('gen()', () => {
    it('should generate an ID of default length', () => {
      const id = service.gen();
      expect(id.length).toEqual(15);
    });

    it('should generate an ID of specified length', () => {
      const length = 10;
      const id = service.gen(length);
      expect(id.length).toEqual(length);
    });

    it('should generate unique IDs', () => {
      const ids = new Set<string>();
      for (let i = 0; i < 1000; i++) {
        const id = service.gen();
        expect(ids.has(id)).toBe(false);
        ids.add(id);
      }
    });
  });
});

import { TrelloDomAdapter } from '../adapters/TrelloDomAdapter';

export class TutorialEngine {
  private adapter = new TrelloDomAdapter();

  getCurrentStep() {
    // Logic for tutorial state machine
    return 1;
  }
}
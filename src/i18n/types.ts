export type Language = 'pt' | 'en' | 'es';

export interface Translations {
  app: {
    title: string;
    subtitle: string;
    speed: string;
    start: string;
    pause: string;
    reset: string;
    resetConfirm: string;
    exportLog: string;
    clearLog: string;
    sprint: string;
    day: string;
    hour: string;
    morale: string;
    risk: string;
    velocity: string;
    wip: string;
    completion: string;
    xp: string;
    level: string;
    decisions: string;
    achievements: string;
  };
  navigation: {
    settings: string;
    profile: string;
    handbook: string;
    auditLog: string;
    openChat: string;
    closeChat: string;
    liveDemo: string;
    language: string;
    theme: string;
  };
  columns: {
    backlog: string;
    inProgress: string;
    codeReview: string;
    done: string;
    addCard: string;
    wipLimitReached: string;
    storyPoints: string;
  };
  chat: {
    title: string;
    subtitle: string;
    channelsTitle: string;
    channelGeneral: string;
    channelDev: string;
    channelSm: string;
    channelAlerts: string;
    provokeDecision: string;
    coffeeBreak: string;
    inputPlaceholder: string;
    emptyChannel: string;
    emptyChannelDesc: string;
    decisionTaken: string;
    decisionPending: string;
    decisionApplied: string;
    whyThisDecision: string;
  };
  modals: {
    welcomeTitle: string;
    welcomeSubtitle: string;
    startGame: string;
    settingsTitle: string;
    apiKeyLabel: string;
    save: string;
    cancel: string;
    close: string;
    sprintCompleteTitle: string;
    newSprint: string;
    profileTitle: string;
    careerReset: string;
  };
  risks: {
    low: string;
    medium: string;
    high: string;
  };
}

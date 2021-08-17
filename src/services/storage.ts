import Flashcard from "src/entities/Card";

export interface StorageConfiguration {
  load: () => Promise<any>;
  save: (data: any) => Promise<void>;
}

export interface Storage {
  settings: Settings;
  updateSettings: (settings: Settings) => void;
  flashcards: Flashcard[];
  updateFlashcards: (flashcards: Flashcard[]) => void;
}

export interface Settings {
  mySetting: string;
  showRibbonIcon: boolean;
}

const defaultSettings: Settings = {
  mySetting: "default",
  showRibbonIcon: true,
};

export default async function configureStorage({
  load,
  save,
}: StorageConfiguration): Promise<Storage> {
  const data = await load()

  const sync = async (execution: () => void) => {
    execution();
    await save(storage);
  };

  const updateFlashcards = async function (flashcards: Flashcard[]) {
    sync(() => (this.flashcards = flashcards));
  };

  const storage: Storage = {
    settings: defaultSettings,
    updateSettings: async function (settings: Settings) {
      sync(() => (this.settings = settings));
    },
    flashcards: [] as Flashcard[],
    updateFlashcards: updateFlashcards,
    ...data,
  };

  return storage;
}

import { Subject } from 'rxjs';

import { Menu } from './menu.model';
import { MessageType } from './error-handler.model';

export type AlertType = MessageType | 'Q';
export type AlertDialogAction = 'DISCARD' | 'OK' | 'CANCEL' | 'CLOSE' | 'CONTINUE' | 'DONE' | 'CONFIRM' | 'UPDATE' | 'YES' | 'NO';
export type ScreenAccess = 'R' | 'W' | 'RW' | 'D' | 'RWD' | 'S' | 'RWS' | 'E' | 'RWE';

export class Plant {
  plantCode: string;
  plantDescription: string;
  companyCode: string;

  setPlantMetaData(plant: Plant) {
    this.companyCode = plant.companyCode || 'APIL';
    this.plantDescription = plant.plantDescription;
    return this;
  }

  constructor(init?: Partial<Plant>) {
    Object.assign(this, init);
  }
}

export class ScreenAuthorization {
  plantCode: string;
  designation: string;
  screenName: string;
  authorizations: ScreenAccess;
  constructor(init?: Partial<ScreenAuthorization>) {
    Object.assign(this, init);
  }
}

export class User {
  private _currentPlant: Plant;

  userId: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  email?: string;
  plants = new Array<Plant>();
  menus = new Array<Menu>();
  designation: string;
  activeDirectoryGroup: string;
  screenAuthorizations = new Array<ScreenAuthorization>();
  plantChangeEmitter = new Subject<string>();

  get companyCode() {
    return this._currentPlant.companyCode;
  }

  get currentPlant() {
    return this._currentPlant || new Plant();
  }

  setScreenAuthorizations(authorizations: ScreenAuthorization[]) {
    this.screenAuthorizations = authorizations || [];
  }

  setDesignation(designation: string) {
    this.designation = designation;
  }

  setPlants(plants: Plant[]) {
    this.plants = this.sortPlantCodes(plants) || [];

    return this;
  }

  setDefaultPlant() {
    if (!this.currentPlant.plantCode && this.plants.length) {
      const plantExists = this.plants.find(plant => plant.plantCode.startsWith('11'));
      if (plantExists) {
        this.changeCurrentPlantCode(plantExists.plantCode);
      } else {
        this.changeCurrentPlantCode(this.plants[0].plantCode);
      }
    }

    return this;
  }

  setEachPlantMetadata(plantsMetadata: Plant[]) {
    for (const plant of this.plants) {
      const plantMetadataFound = plantsMetadata.find(plantMetadata => plantMetadata.plantCode === plant.plantCode);
      if (plantMetadataFound) {
        plant.setPlantMetaData(plantMetadataFound);
      }
    }

    return this;
  }

  changeCurrentPlantCode(plantCode: string) {
    plantCode = plantCode.trim();
    const plantFound = this.plants.find(plant => plant.plantCode === plantCode);
    if (plantFound) {
      this._currentPlant = plantFound;
      this.plantChangeEmitter.next(plantCode);
    } else {
      throw new Error(`Could not find plant code:${plantCode} in the list of plants.`);
    }

    return this;
  }

  private sortPlantCodes(plantCodes: Plant[]): Plant[] {
    return plantCodes.sort((first, second) => {
      return Number(first.plantCode.match(/(\d+)/g)[0]) - Number(second.plantCode.match(/(\d+)/g)[0]);
    });
  }

  constructor(init?: Partial<User>) {
    Object.assign(this, init);
  }
}

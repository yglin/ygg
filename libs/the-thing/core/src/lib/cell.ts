import { TheThing } from "./the-thing";
import { DNAPool } from "./dna-pool";
import { DNA } from "./dna";

interface TheThingCellForgeOptions {
  DNAs?: string[] | string;
}

export class TheThingCell {
  static forge(options: TheThingCellForgeOptions = {}): TheThingCell {
    const cell = new TheThingCell();
    let DNAs: DNA[];
    if (options.DNAs) {
      if (typeof options.DNAs === 'string' && options.DNAs === 'all') {
        DNAs = DNAPool.getAll();
      } else {
        DNAs = DNAPool.getDNAs(options.DNAs as string[]);
      }
    }
    return cell;
  }

  forgeTheThing(): TheThing {
    const thing = TheThing.forge();
    return thing;
  }

}
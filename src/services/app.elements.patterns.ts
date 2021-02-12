import { TextNodePattern } from '@uprtcl/documents';
import { Pattern, HasChildren } from '@uprtcl/evees';

import { Dashboard, LT_TextNode, Section } from '../containers/types';

export const DashboardType = 'LinkedThoughts:Dashboard';
export const SectionType = 'LinkedThoughts:Section';
export const HomeType = 'LinkedThoughts:UserHome';
export const LT_TextNodeType = 'LinkedThoughts:LT_TextNode';

export class AppHomePattern extends Pattern<any> {
  recognize(object: any): boolean {
    return !!object.linkedThoughts;
  }

  type = HomeType;

  constructor() {
    super([new AppHomeBehaviors()]);
  }
}

export class AppHomeBehaviors implements HasChildren<any> {
  links = async (node: any) => this.children(node);

  replaceChildren = (node: any) => (childrenHashes: string[]): any => ({
    ...node,
    linkedThoughts: childrenHashes[0],
  });

  children = (node: any): string[] => [node.linkedThoughts];
}

export class DashboardPattern extends Pattern<Dashboard> {
  recognize(object: any): boolean {
    return !!object.sections;
  }

  type = DashboardType;

  constructor() {
    super([new DashboardBehaviors()]);
  }
}

export class DashboardBehaviors implements HasChildren<Dashboard> {
  links = async (node: Dashboard) => this.children(node);

  replaceChildren = (node: Dashboard) => (
    childrenHashes: string[]
  ): Dashboard => ({
    ...node,
    sections: childrenHashes,
  });

  children = (node: Dashboard): string[] => node.sections;
}

export class SectionPattern extends Pattern<Section> {
  recognize(object: any): boolean {
    return object.title !== undefined && object.pages !== undefined;
  }

  type = SectionType;

  constructor() {
    super([new SectionBehaviors()]);
  }
}

export class SectionBehaviors implements HasChildren<Section> {
  title = async (node: Section) => node.title;

  links = async (node: Section) => this.children(node);

  replaceChildren = (node: Section) => (childrenHashes: string[]): Section => ({
    ...node,
    pages: childrenHashes,
  });

  children = (node: Section): string[] => node.pages;
}

export class LT_TextNodePattern extends TextNodePattern {
  recognize(object: any): boolean {
    return (
      super.recognize(object) &&
      object.meta !== undefined &&
      object.meta.isA !== undefined
    );
  }

  type = LT_TextNodeType;

  constructor() {
    super([new LT_TextNodeBehaviors()]);
  }
}

export class LT_TextNodeBehaviors implements HasLinks<LT_TextNode> {
  linksTo = async (node: LT_TextNode) => node.meta.isA;
  replaceLinksTo = (node: LT_TextNode) => (links: string[]): LT_TextNode => ({
    ...node,
    meta: {
      isA: links,
    },
  });
}

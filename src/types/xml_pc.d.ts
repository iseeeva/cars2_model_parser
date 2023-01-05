export interface XML {
  root_node: RootNode;
}

export interface RootNode {
  SubNetworkPool:     SubNetworkPool;
  CollisionShapePool: CollisionShapePool;
  PhysicsBodyPool:    PhysicsBodyPool;
  DisplayLayerPool:   DisplayLayerPool;
  TexturePool:        TexturePool;
  MaterialPool:       MaterialPool;
  VertexBufferPool:   VertexBufferPool;
  IndexBufferPool:    IndexBufferPool;
  IndexStreamPool:    IndexStreamPool;
  VertexStreamPool:   VertexStreamPool;
  SceneComponentPool: SceneComponentPool;
  SceneTreeNodePool:  SceneTreeNodePool;
  AssociationPool:    AssociationPool;
  ExporterDate:       Entry;
  ExporterTime:       Entry;
}

export interface AssociationPool {
  Association: Association[];
}

export interface Association {
  NodeName:           Entry;
  Type:               Entry;
  NodeRef?:           Entry;
  ComponentRef?:      Entry;
  _type:              AssociationType;
  _text:             string;
  SceneTreeNodeRef?:  Entry;
  SubNetworkRef?:     Entry;
  LazyDataNodeName?:  Entry;
  MaterialRef?:       Entry;
  PhysicsBodyRef?:    Entry;
  CollisionShapeRef?: Entry;
}

export interface Entry {
  _type:  EntryTypes;
  _text: string;
}

export enum EntryTypes {
  Float = "float",
  Int24 = "int24",
  Int8 = "int8",
  String = "string",
  Uint16 = "uint16",
  Uint32 = "uint32",
}

export enum AssociationType {
  ReferenceString = "reference_string",
  StringFloat32List = "string_float32_list",
}

export interface CollisionShapePool {
  Shape: ShapeElement[];
}

export interface ShapeElement {
  ShapeType:        Entry;
  SurfaceType?:     Entry;
  CollisionLayer?:  Entry;
  Points?:          EntryArray;
  CollisionMargin?: Entry;
  _type:            AssociationType;
  _text:           string;
  Shapes?:          Shapes;
}

export interface EntryArray {
  entry: { _text: string } | { _text: string }[];
  _type: EntryArrayTypes;
}

export enum EntryArrayTypes {
  FloatList = "float_list",
  Int8List = "int8_list",
  StringList = "string_list",
  Uint16List = "uint16_list",
  Uint16Uint16ListAlt = "uint16_uint16_list_alt",
  Uint16Uint8Bin = "uint16_uint8_bin",
  Uint8List = "uint8_list",
}

export interface Shapes {
  Shape: ShapesShape;
}

export interface ShapesShape {
  ShapeRef:  Entry;
  Transform: EntryArray;
  _type:     AssociationType;
  _text:    string;
}

export interface DisplayLayerPool {
  DisplayLayer: DisplayLayer;
}

export interface DisplayLayer {
  Name:   Entry;
  Mask:   Entry;
  _type:  AssociationType;
  _text: string;
}

export interface IndexBufferPool {
  IndexBuffer: ExBuffer[];
}

export interface ExBuffer {
  Width?:    Entry;
  Name:      Entry;
  Flags:     Entry;
  Size:      Entry;
  FileName?: Entry;
  _type:     AssociationType;
  _text:    string;
  HeapLoc?:  Entry;
}

export interface IndexStreamPool {
  IndexStream: IndexStream[];
}

export interface IndexStream {
  Length:               Entry;
  IndexBufferReference: Entry;
  IndexBufferOffset:    Entry;
  IndexStreamPrimitive: Entry;
  IndexStreamElement:   IndexStreamElement;
  _type:                AssociationType;
  _text:               string;
}

export interface IndexStreamElement {
  _type: EntryTypes;
}

export interface MaterialPool {
  Material: Material[];
}

export interface Material {
  Type:            Entry;
  Name:            Entry;
  Effect:          Entry;
  PropertyEntries: PropertyEntries;
  _type:           AssociationType;
  _text:          string;
  Uuid?:           EntryArray;
  RenderCaps?:     Entry;
  TextureEntries?: TextureEntries;
}

export interface PropertyEntries {
  PropertyEntry: PropertyEntryElement[] | PurplePropertyEntry;
}

export interface PropertyEntryElement {
  Name:     Entry;
  Type:     Entry;
  DataType: Entry;
  Value:    Value;
  _type:    AssociationType;
  _text:   string;
}

export interface Value {
  entry?:  string[];
  _type:   LocalToLocalProxyType;
  _text?: string;
}

export enum LocalToLocalProxyType {
  Float = "float",
  FloatList = "float_list",
  Int8 = "int8",
  StringFloat32List = "string_float32_list",
}

export interface PurplePropertyEntry {
  Name:     Entry;
  Type:     Entry;
  DataType: Entry;
  Value:    EntryArray;
  _type:    AssociationType;
  _text:   string;
}

export interface TextureEntries {
  TextureEntry: TextureEntryElement[] | TextureEntryElement;
}

export interface TextureEntryElement {
  TextureReference: Entry;
  Usage:            Entry;
  _type:            AssociationType;
  _text:           string;
}

export interface PhysicsBodyPool {
  PhysicsBody: PhysicsBody;
}

export interface PhysicsBody {
  BodyType:            Entry;
  Mass:                Entry;
  LinearDamping:       Entry;
  AngularDamping:      Entry;
  Restitution:         Entry;
  Friction:            Entry;
  Kinematic:           Entry;
  DisableDeactivation: Entry;
  CenterOfMass:        EntryArray;
  InertiaTensor:       EntryArray;
  _type:               AssociationType;
  _text:              string;
}

export interface SceneComponentPool {
  SceneComponent: SceneComponent[];
}

export interface SceneComponent {
  Type:       Entry;
  RemapData?: RemapData;
  _type:      AssociationType;
  _text:     string;
}

export interface RemapData {
  entry: { _text: string } | { _text: string }[];
  _type: EntryArrayTypes;
}

export interface SceneTreeNodePool {
  Node: Node[];
}

export interface Node {
  Type:                      Entry;
  _type:                     AssociationType;
  _text:                    string;
  NodeName?:                 Entry;
  Uuid?:                     EntryArray;
  DisplayLayer?:             Entry;
  BoundingSphereCenter?:     EntryArray;
  BoundingSphereRadius?:     Entry;
  BoundingOBBOrientation?:   EntryArray;
  BoundingOBBCenter?:        EntryArray;
  BoundingOBBExtents?:       EntryArray;
  BoundingBox?:              EntryArray;
  BoundingType?:             Entry;
  ParentNodeReferences?:     ParentNodeReferences;
  LocalToParentMatrix?:      EntryArray;
  ParentGeometryReference?:  Entry;
  BillboardType?:            Entry;
  BoneID?:                   Entry;
  BoneCount?:                Entry;
  BoneToModelMatrix?:        EntryArray;
  BoneToStandardMatrix?:     EntryArray;
  PivotPoint?:               EntryArray;
  BoneEndPoint?:             EntryArray;
  NumAssignedVerts?:         Entry;
  VizCullingBound?:          Entry;
  Visible?:                  Entry;
  DynamicVisPlacement?:      Entry;
  MeshName?:                 Entry;
  BoundingCenter?:           EntryArray;
  RenderCaps?:               Entry;
  MaterialReference?:        Entry;
  VertexStreamReferences?:   EntryArray;
  IndexStreamReference?:     Entry;
  SceneComponentReferences?: ParentNodeReferences;
}

export interface ParentNodeReferences {
  entry: { _text: string } | { _text: string }[];
  _type: EntryArrayTypes;
}

export interface SubNetworkPool {
  SubNetwork: SubNetwork;
}

export interface SubNetwork {
  Name:                       Entry;
  Type:                       Entry;
  HeaderStrings:              EntryArray;
  HeaderStringIndices:        EntryArray;
  HeaderLayout:               EntryArray;
  DataNodePool:               DataNodePool;
  ProcessorNodePool:          ProcessorNodePool;
  ConnectionMapUsedDataNodes: EntryArray;
  RestPositionIndices:        EntryArray;
  RestPositionData:           EntryArray;
  BaseDataNodeLinksPool:      BaseDataNodeLinksPool;
  NetworkBuffer:              EntryArray;
  _type:                      AssociationType;
  _text:                     string;
}

export interface BaseDataNodeLinksPool {
  BaseDataNodeLinks: BaseDataNodeLink[];
}

export interface BaseDataNodeLink {
  Name:               Entry;
  ConnectionTemplate: Entry;
  DataNodeLinks:      EntryArray;
  _type:              AssociationType;
  _text:             string;
}

export interface DataNodePool {
  DataNode: DataNode[];
}

export interface DataNode {
  Header:                   Entry;
  Type:                     Entry;
  Data?:                    DataData | string;
  _type:                    AssociationType;
  _text:                   string;
  BasisDataNodeRef?:        Entry;
  Static?:                  Entry;
  RelationshipDataBlock?:   EntryArray;
  Length?:                  Entry;
  UberConstraintDataBlock?: EntryArray;
  ClipDataBlock?:           EntryArray;
}

export interface DataData {
  _type?:        LocalToLocalProxyType;
  _text?:       string;
  Translation?:  EntryArray;
  entry?:        string[];
  Orientation?:  Orientation;
  InheritScale?: Entry;
  Scale?:        EntryArray;
}

export interface Orientation {
  ParentProxyToParent?: Value;
  LocalToLocalProxy?:   Value;
  _type:                AssociationType;
  _text:               Text;
  entry?:               string[];
}

export enum Text {
  OrientProxy = "OrientProxy",
  Rotor = "Rotor",
}

export interface ProcessorNodePool {
  ProcessorNode: ProcessorNode[];
}

export interface ProcessorNode {
  Header:                   Entry;
  Type:                     Entry;
  DataNodeRefs?:            EntryArray;
  DataNodeAttributes?:      EntryArray;
  _type:                    AssociationType;
  _text:                   string;
  RelationshipData?:        Entry;
  LazyDataNode?:            Entry;
  Input?:                   Input;
  Output?:                  RemapData;
  NetworkBufferOffsets?:    ParentNodeReferences;
  NetworkBufferNames?:      ParentNodeReferences;
  UberConstraintDataInput?: Entry;
  ClipData?:                Entry;
}

export interface Input {
  entry?:  string[] | string;
  _type:   InputType;
  _text?: string;
}

export enum InputType {
  Int8List = "int8_list",
  Uint16 = "uint16",
  Uint16List = "uint16_list",
}

export interface TexturePool {
  Texture: Texture[];
}

export interface Texture {
  Name:           Entry;
  DataCRC:        Entry;
  SourceFilePath: Entry;
  Type:           Entry;
  Data:           TextureData;
  _type:          AssociationType;
  _text:         string;
}

export interface TextureData {
  _type:     string;
  _filepath: string;
}

export interface VertexBufferPool {
  VertexBuffer: ExBuffer[];
}

export interface VertexStreamPool {
  VertexStream: VertexStream[];
}

export interface VertexStream {
  Length:                Entry;
  Width:                 Entry;
  ExtraStride:           Entry;
  VertexBufferReference: Entry;
  VertexBufferOffset:    Entry;
  Elements:              Elements;
  _type:                 AssociationType;
  _text:                string;
}

export interface Elements {
  Element: ElementElement[] | ElementElement;
}

export interface ElementElement {
  Type:   Entry;
  Name:   Entry;
  Offset: Entry;
  _type:  AssociationType;
  _text: string;
}

export enum DesciptorType {
	Building,
	Item,
	Equipment2,
	Consumeble,
	Vehicle,
	Resource
}

export enum TypeInformation {
	Recipe,
	Boiler,
	Turbine,
	Heater,
	Cooler,
	Cleaner,
	Extractor,
	ExtractorWasteProducer,
	ExtractorConsumer,
	AirCollector,
	SeedExtractor,
	SlugHatcher,
	SlugTerrarium
}

export enum SatisfactoryResourcePurity {
	impure,
	normal,
	pure,
	none=229
}

export enum ItemStackSize {
	single = 1,
	small = 50,
	normal = 100,
	big = 200,
	huge = 500,
	fuild = 50000
}

export enum ItemForm {
	Invalid,
	Solid,
	Liquid,
	Gas,
	Heat
}

export enum SchematicType {
	Custom,
	Cheat,
	Tutorial,
	Milestone,
	Alternate,
	Story,
	MAM,
	ResourceSink,
	HardDrive,
	Prototype
}

export enum SatisfactoryMapType {
	deposits = "deposits",
	geysers = "geysers",
	resourceNode = "resourceNodes",
	resourceWells = "resourceWells",
	lootChests = "lootChests",
	pickup = "pickup"
}

export enum SatisfactoryDataType {
	invalid = "invalid",
	cleaner = "cleaner",
	itemDescriptor = "itemDescriptor",
	resourceMap = "resourceMap",
	buildable = "buildable",
	recipe = "recipe",
	schematic = "schematic",
	researchTree = "researchTree",
	informationItem = "informations",
	informationBuilding = "buildings"
}

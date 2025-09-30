const plantingReturnsTypeDefs = `#graphql
  scalar DateTime


  type PlantingReturn {
    id: ID!
    sr8Number: String

    # Grower / applicant
    applicantName: String
    growerNumber: String
    contactPhone: String

    # Field
    gardenNumber: String
    fieldName: String
    location: PlantingReturnLocation

    # Crop & variety
    cropId: ID
    varietyId: ID
    crop: Crop
    variety: CropVariety
    seedClass: String

    # Planting & production
    areaHa: Float
    dateSown: DateTime
    expectedHarvest: DateTime
    seedSource: String
    seedLotCode: String
    intendedMerchant: String
    seedRatePerHa: String

    # Workflow
    status: String
    statusComment: String
    scheduledVisitDate: String
    inspector: User
    createdBy: User

    createdAt: DateTime
    updatedAt: DateTime
  }

  type PlantingReturnLocation {
        district: String
        subcounty: String
        parish: String
        village: String
        gpsLat: Float
        gpsLng: Float
    }

  type PlantingReturnEdge {
    items: [PlantingReturn!]!
    total: Int!
  }

  input PlantingReturnFilter {
    status: String
    search: String
    district: String
    cropId: ID
    varietyId: ID
    createdById: ID
  }

  input PlantingReturnLocationInput {
    district: String
    subcounty: String
    parish: String
    village: String
    gpsLat: Float
    gpsLng: Float
  }

  input CreatePlantingReturnInput {
    applicantName: String
    growerNumber: String
    contactPhone: String

    gardenNumber: String
    fieldName: String
    location: PlantingReturnLocationInput

    cropId: ID
    varietyId: ID
    seedClass: String

    areaHa: Float
    dateSown: String
    expectedHarvest: String
    seedSource: String
    seedLotCode: String
    intendedMerchant: String
    seedRatePerHa: String
  }

  input UpdatePlantingReturnInput {
    applicantName: String
    growerNumber: String
    contactPhone: String

    gardenNumber: String
    fieldName: String
    location: PlantingReturnLocationInput

    cropId: ID
    varietyId: ID
    seedClass: String

    areaHa: Float
    dateSown: String
    expectedHarvest: String
    seedSource: String
    seedLotCode: String
    intendedMerchant: String
    seedRatePerHa: String

    # Scheduling
    scheduledVisitDate: String
  }


  input AssignPlantingReturnInspectorInput {
    id: ID
    ids: [ID!]
    inspectorId: ID!
    scheduledVisitDate: String
    comment: String
}

  input ApprovePlantingReturnInput {
    id: ID!
    comment: String
  }

  input RejectPlantingReturnInput {
    id: ID!
    comment: String
  }

  input HaltPlantingReturnInput {
    id: ID!
    comment: String
  }

  type PlantingReturnPayload {
    success: Boolean!
    message: String
    record: PlantingReturn
  }

  type BasicPayload {
    success: Boolean!
    message: String
  }

 type Query {
    plantingReturns(filter: PlantingReturnFilter, pagination: PaginationInput): PlantingReturnEdge
    plantingReturn(id: ID!): PlantingReturn
  }

 type Mutation {
    createPlantingReturn(input: CreatePlantingReturnInput!): PlantingReturnPayload
    updatePlantingReturn(id: ID!, input: UpdatePlantingReturnInput!): PlantingReturnPayload
    deletePlantingReturn(id: ID!): BasicPayload

    assignPlantingReturnInspector(input: AssignPlantingReturnInspectorInput!): BasicPayload
    approvePlantingReturn(input: ApprovePlantingReturnInput!): BasicPayload
    rejectPlantingReturn(input: RejectPlantingReturnInput!): BasicPayload
    haltPlantingReturn(input: HaltPlantingReturnInput!): BasicPayload
  }
`;

export default plantingReturnsTypeDefs;

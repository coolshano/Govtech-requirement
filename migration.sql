-- CreateTable
CREATE TABLE "OnboardingRequest" (
    "id" SERIAL NOT NULL,
    "instituteName" TEXT NOT NULL,
    "department" TEXT,
    "appName" TEXT NOT NULL,
    "goLiveDate" TEXT,
    "networkBandwidth" TEXT,
    "workloadType" TEXT NOT NULL,
    "targetEnvironment" TEXT NOT NULL,
    "osPreference" TEXT NOT NULL,
    "vCpu" TEXT NOT NULL,
    "ram" TEXT NOT NULL,
    "storageType" TEXT,
    "storageSize" TEXT NOT NULL,
    "highAvailability" TEXT NOT NULL,
    "workloadCriticality" TEXT,
    "dbEngine" TEXT NOT NULL,
    "backupPolicy" TEXT,
    "techContactName" TEXT NOT NULL,
    "techContactEmail" TEXT NOT NULL,
    "billingEmail" TEXT NOT NULL,
    "backupRetention" TEXT NOT NULL,
    "firewallRules" TEXT,
    "wafRequired" TEXT,
    "architectureDiagram" TEXT,
    "receivedDate" TEXT,
    "dateSentToSlt" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "OnboardingRequest_pkey" PRIMARY KEY ("id")
);


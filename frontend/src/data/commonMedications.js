const commonMedications = [
  {
    name: "Paracetamol",
    commonDosages: ["500mg", "650mg", "1000mg"],
    category: "Analgesic/Antipyretic"
  },
  {
    name: "Ibuprofen",
    commonDosages: ["200mg", "400mg", "600mg"],
    category: "NSAID"
  },
  {
    name: "Aspirin",
    commonDosages: ["75mg", "100mg", "325mg"],
    category: "NSAID/Antiplatelet"
  },
  {
    name: "Amoxicillin",
    commonDosages: ["250mg", "500mg", "875mg"],
    category: "Antibiotic"
  },
  {
    name: "Azithromycin",
    commonDosages: ["250mg", "500mg"],
    category: "Antibiotic"
  },
  {
    name: "Ciprofloxacin",
    commonDosages: ["250mg", "500mg", "750mg"],
    category: "Antibiotic"
  },
  {
    name: "Metformin",
    commonDosages: ["500mg", "850mg", "1000mg"],
    category: "Antidiabetic"
  },
  {
    name: "Lisinopril",
    commonDosages: ["5mg", "10mg", "20mg"],
    category: "ACE Inhibitor"
  },
  {
    name: "Amlodipine",
    commonDosages: ["2.5mg", "5mg", "10mg"],
    category: "Calcium Channel Blocker"
  },
  {
    name: "Atorvastatin",
    commonDosages: ["10mg", "20mg", "40mg", "80mg"],
    category: "Statin"
  },
  {
    name: "Omeprazole",
    commonDosages: ["20mg", "40mg"],
    category: "Proton Pump Inhibitor"
  },
  {
    name: "Pantoprazole",
    commonDosages: ["20mg", "40mg"],
    category: "Proton Pump Inhibitor"
  },
  {
    name: "Cetirizine",
    commonDosages: ["5mg", "10mg"],
    category: "Antihistamine"
  },
  {
    name: "Loratadine",
    commonDosages: ["10mg"],
    category: "Antihistamine"
  },
  {
    name: "Salbutamol",
    commonDosages: ["2mg", "4mg", "100mcg/puff"],
    category: "Bronchodilator"
  },
  {
    name: "Prednisolone",
    commonDosages: ["5mg", "10mg", "20mg"],
    category: "Corticosteroid"
  },
  {
    name: "Diclofenac",
    commonDosages: ["25mg", "50mg", "75mg"],
    category: "NSAID"
  },
  {
    name: "Tramadol",
    commonDosages: ["50mg", "100mg"],
    category: "Opioid Analgesic"
  },
  {
    name: "Gabapentin",
    commonDosages: ["100mg", "300mg", "400mg"],
    category: "Anticonvulsant"
  },
  {
    name: "Furosemide",
    commonDosages: ["20mg", "40mg", "80mg"],
    category: "Diuretic"
  },
  {
    name: "Warfarin",
    commonDosages: ["1mg", "2mg", "5mg"],
    category: "Anticoagulant"
  },
  {
    name: "Clopidogrel",
    commonDosages: ["75mg"],
    category: "Antiplatelet"
  },
  {
    name: "Levothyroxine",
    commonDosages: ["25mcg", "50mcg", "75mcg", "100mcg"],
    category: "Thyroid Hormone"
  },
  {
    name: "Insulin Glargine",
    commonDosages: ["100 units/ml"],
    category: "Long-acting Insulin"
  },
  {
    name: "Insulin Lispro",
    commonDosages: ["100 units/ml"],
    category: "Rapid-acting Insulin"
  },
  {
    name: "Montelukast",
    commonDosages: ["4mg", "5mg", "10mg"],
    category: "Leukotriene Receptor Antagonist"
  },
  {
    name: "Sertraline",
    commonDosages: ["25mg", "50mg", "100mg"],
    category: "SSRI Antidepressant"
  },
  {
    name: "Fluoxetine",
    commonDosages: ["10mg", "20mg", "40mg"],
    category: "SSRI Antidepressant"
  },
  {
    name: "Alprazolam",
    commonDosages: ["0.25mg", "0.5mg", "1mg"],
    category: "Benzodiazepine"
  },
  {
    name: "Zolpidem",
    commonDosages: ["5mg", "10mg"],
    category: "Hypnotic"
  },
  {
    name: "Ranitidine",
    commonDosages: ["150mg", "300mg"],
    category: "H2 Receptor Antagonist"
  },
  {
    name: "Domperidone",
    commonDosages: ["10mg"],
    category: "Prokinetic Agent"
  },
  {
    name: "Loperamide",
    commonDosages: ["2mg"],
    category: "Antidiarrheal"
  },
  {
    name: "Simvastatin",
    commonDosages: ["10mg", "20mg", "40mg"],
    category: "Statin"
  },
  {
    name: "Metoprolol",
    commonDosages: ["25mg", "50mg", "100mg"],
    category: "Beta Blocker"
  },
  {
    name: "Hydrochlorothiazide",
    commonDosages: ["12.5mg", "25mg", "50mg"],
    category: "Thiazide Diuretic"
  },
  {
    name: "Losartan",
    commonDosages: ["25mg", "50mg", "100mg"],
    category: "ARB"
  },
  {
    name: "Glimepiride",
    commonDosages: ["1mg", "2mg", "4mg"],
    category: "Sulfonylurea"
  },
  {
    name: "Gliclazide",
    commonDosages: ["40mg", "80mg"],
    category: "Sulfonylurea"
  },
  {
    name: "Vitamin D3",
    commonDosages: ["1000 IU", "2000 IU", "5000 IU"],
    category: "Vitamin"
  },
  {
    name: "Calcium Carbonate",
    commonDosages: ["500mg", "1000mg"],
    category: "Mineral Supplement"
  },
  {
    name: "Iron Sulfate",
    commonDosages: ["200mg", "300mg"],
    category: "Iron Supplement"
  },
  {
    name: "Folic Acid",
    commonDosages: ["400mcg", "5mg"],
    category: "Vitamin B9"
  },
  {
    name: "Vitamin B12",
    commonDosages: ["500mcg", "1000mcg"],
    category: "Vitamin"
  },
  {
    name: "Multivitamin",
    commonDosages: ["1 tablet"],
    category: "Vitamin Supplement"
  }
];

export default commonMedications;
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const { Vehicle } = require('../models');

const CSV_FILE_PATH = path.join(__dirname, '../data/vehicles.csv');

// Column mapping from CSV headers to Vehicle model fields
const COLUMN_MAPPING = {
  // CSV column name -> Vehicle model field
  'brand': 'brand',
  'Brand': 'brand',
  'BRAND': 'brand',
  'model': 'model',
  'Model': 'model',
  'MODEL': 'model',
  'Type': 'type',
  'type': 'type',
  'TYPE': 'type',
  'Cars Prices': 'price',
  'price': 'price',
  'Price': 'price',
  'PRICE': 'price',
  'Seats': 'seats',
  'seats': 'seats',
  'SEATS': 'seats',
  'Range (Km)': 'range',
  'Range': 'range',
  'range': 'range',
  'RANGE': 'range',
  'Year ': 'year', // Note the space in your CSV
  'Year': 'year',
  'year': 'year',
  'YEAR': 'year',
  'Quantity': 'quantity',
  'quantity': 'quantity',
  'QUANTITY': 'quantity',
  'description': 'description',
  'Description': 'description',
  'DESCRIPTION': 'description'
};

// Function to clean and parse price values
const parsePrice = (priceStr) => {
  if (!priceStr) return 0;
  // Remove currency symbols, commas, and quotes
  const cleaned = priceStr.toString().replace(/[$,"\s]/g, '');
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

// Function to clean and parse numeric values
const parseNumeric = (value) => {
  if (!value) return 0;
  const cleaned = value.toString().replace(/[,"\s]/g, '');
  const parsed = parseInt(cleaned);
  return isNaN(parsed) ? 0 : parsed;
};

// Function to map CSV row to Vehicle model format
const mapCsvRowToVehicle = (row) => {
  const vehicleData = {};
  const unusedColumns = [];
  
  // Map each CSV column to Vehicle model field
  Object.keys(row).forEach(csvColumn => {
    const trimmedColumn = csvColumn.trim();
    let modelField = COLUMN_MAPPING[trimmedColumn];
    
    // If exact match not found, try case-insensitive matching
    if (!modelField) {
      const lowerColumn = trimmedColumn.toLowerCase();
      const mappingKey = Object.keys(COLUMN_MAPPING).find(key => 
        key.toLowerCase() === lowerColumn
      );
      if (mappingKey) {
        modelField = COLUMN_MAPPING[mappingKey];
      }
    }
    
    // If still no match, try partial matching for common variations
    if (!modelField) {
      const lowerColumn = trimmedColumn.toLowerCase();
      if (lowerColumn.includes('brand')) modelField = 'brand';
      else if (lowerColumn.includes('model')) modelField = 'model';
      else if (lowerColumn.includes('type')) modelField = 'type';
      else if (lowerColumn.includes('price')) modelField = 'price';
      else if (lowerColumn.includes('seat')) modelField = 'seats';
      else if (lowerColumn.includes('range')) modelField = 'range';
      else if (lowerColumn.includes('year')) modelField = 'year';
      else if (lowerColumn.includes('quantity')) modelField = 'quantity';
      else if (lowerColumn.includes('description')) modelField = 'description';
    }
    
    if (modelField && row[csvColumn] && row[csvColumn].toString().trim() !== '') {
      let value = row[csvColumn].toString().trim();
      
      // Special handling for different field types
      switch (modelField) {
        case 'price':
          vehicleData[modelField] = parsePrice(value);
          break;
        case 'seats':
        case 'range':
        case 'year':
        case 'quantity':
          vehicleData[modelField] = parseNumeric(value);
          break;
        case 'type':
        case 'brand':
        case 'model':
          vehicleData[modelField] = value;
          break;
        case 'description':
          vehicleData[modelField] = value || '';
          break;
      }
    } else if (row[csvColumn] && row[csvColumn].toString().trim() !== '') {
      // This column wasn't mapped to a model field, so add it to unused columns
      const columnValue = row[csvColumn].toString().trim();
      if (columnValue && columnValue !== '' && columnValue !== 'undefined' && columnValue !== 'null') {
        unusedColumns.push(`${trimmedColumn}: ${columnValue}`);
      }
    }
  });
  
  // Set default values for missing fields
  if (!vehicleData.description) vehicleData.description = '';
  if (!vehicleData.quantity) vehicleData.quantity = 0;
  
  // Add unused columns to description
  if (unusedColumns.length > 0) {
    const additionalInfo = unusedColumns.join('\n');
    if (vehicleData.description && vehicleData.description.trim() !== '') {
      vehicleData.description += `\n\nAdditional info:\n${additionalInfo},`;
    } else {
      vehicleData.description = additionalInfo;
    }
  }
  
  return vehicleData;
};

// Ensure data directory exists
const ensureDataDirectory = () => {
  const dataDir = path.dirname(CSV_FILE_PATH);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

// CSV Writer configuration
const csvWriter = createCsvWriter({
  path: CSV_FILE_PATH,
  header: [
    { id: 'vid', title: 'VID' },
    { id: 'type', title: 'Type' },
    { id: 'brand', title: 'Brand' },
    { id: 'model', title: 'Model' },
    { id: 'year', title: 'Year' },
    { id: 'seats', title: 'Seats' },
    { id: 'range', title: 'Range' },
    { id: 'quantity', title: 'Quantity' },
    { id: 'price', title: 'Price' },
    { id: 'description', title: 'Description' }
  ]
});

// Export all vehicles to CSV
const exportVehiclesToCSV = async () => {
  try {
    ensureDataDirectory();
    
    const vehicles = await Vehicle.findAll({
      attributes: ['vid', 'type', 'brand', 'model', 'year', 'seats', 'range', 'quantity', 'price', 'description']
    });
    
    const vehicleData = vehicles.map(vehicle => ({
      vid: vehicle.vid,
      type: vehicle.type,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      seats: vehicle.seats,
      range: vehicle.range,
      quantity: vehicle.quantity,
      price: vehicle.price,
      description: vehicle.description || ''
    }));
    
    await csvWriter.writeRecords(vehicleData);
    return { success: true, message: 'Vehicles exported to CSV successfully', count: vehicleData.length };
  } catch (error) {
    console.error('Error exporting vehicles to CSV:', error);
    throw error;
  }
};

// Add single vehicle to CSV
const addVehicleToCSV = async (vehicle) => {
  try {
    ensureDataDirectory();
    
    const vehicleData = {
      vid: vehicle.vid,
      type: vehicle.type,
      brand: vehicle.brand,
      model: vehicle.model,
      year: vehicle.year,
      seats: vehicle.seats,
      range: vehicle.range,
      quantity: vehicle.quantity,
      price: vehicle.price,
      description: vehicle.description || ''
    };
    
    // Check if CSV exists, if not create it with all vehicles
    if (!fs.existsSync(CSV_FILE_PATH)) {
      await exportVehiclesToCSV();
    } else {
      // Append single vehicle to existing CSV
      const csvAppendWriter = createCsvWriter({
        path: CSV_FILE_PATH,
        header: [
          { id: 'vid', title: 'VID' },
          { id: 'type', title: 'Type' },
          { id: 'brand', title: 'Brand' },
          { id: 'model', title: 'Model' },
          { id: 'year', title: 'Year' },
          { id: 'seats', title: 'Seats' },
          { id: 'range', title: 'Range' },
          { id: 'quantity', title: 'Quantity' },
          { id: 'price', title: 'Price' },
          { id: 'description', title: 'Description' }
        ],
        append: true
      });
      
      await csvAppendWriter.writeRecords([vehicleData]);
    }
    
    return { success: true, message: 'Vehicle added to CSV successfully' };
  } catch (error) {
    console.error('Error adding vehicle to CSV:', error);
    throw error;
  }
};

// Import vehicles from CSV
const importVehiclesFromCSV = async (csvFilePath) => {
  return new Promise((resolve, reject) => {
    const vehicles = [];
    const errors = [];
    let imported = 0;
    let skipped = 0;
    let lineNumber = 1;

    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        lineNumber++;
        try {
          const vehicleData = mapCsvRowToVehicle(row);
          
          // Only validate truly essential fields - others can be missing
          const essentialFields = ['brand', 'model', 'type'];
          const missingEssentialFields = essentialFields.filter(field => !vehicleData[field] || vehicleData[field].toString().trim() === '');
          
          if (missingEssentialFields.length > 0) {
            errors.push(`Line ${lineNumber}: Missing essential fields: ${missingEssentialFields.join(', ')} for vehicle: ${vehicleData.brand || 'Unknown'} ${vehicleData.model || 'Unknown'}`);
            skipped++;
            return;
          }
          
          // Set reasonable defaults for missing fields
          if (!vehicleData.year || vehicleData.year === 0) vehicleData.year = new Date().getFullYear();
          if (!vehicleData.seats || vehicleData.seats === 0) vehicleData.seats = 5; // Default to 5 seats
          if (!vehicleData.range || vehicleData.range === 0) vehicleData.range = 300; // Default range
          if (!vehicleData.price || vehicleData.price === 0) vehicleData.price = 10000; // Default price
          if (!vehicleData.quantity) vehicleData.quantity = 1; // Default quantity
          if (!vehicleData.description) vehicleData.description = '';
          
          // Validate ranges for existing values
          if (vehicleData.year < 1900 || vehicleData.year > new Date().getFullYear() + 2) {
            errors.push(`Line ${lineNumber}: Invalid year ${vehicleData.year} - using current year instead`);
            vehicleData.year = new Date().getFullYear();
          }
          
          if (vehicleData.seats < 1 || vehicleData.seats > 20) {
            errors.push(`Line ${lineNumber}: Invalid seats ${vehicleData.seats} - using default 5 seats`);
            vehicleData.seats = 5;
          }
          
          if (vehicleData.range < 0) {
            errors.push(`Line ${lineNumber}: Invalid range ${vehicleData.range} - using default 300km`);
            vehicleData.range = 300;
          }
          
          if (vehicleData.price <= 0) {
            errors.push(`Line ${lineNumber}: Invalid price ${vehicleData.price} - using default $10,000`);
            vehicleData.price = 10000;
          }
          
          vehicles.push(vehicleData);
        } catch (error) {
          errors.push(`Line ${lineNumber}: ${error.message}`);
          skipped++;
        }
      })
      .on('end', async () => {
        try {
          // Import vehicles to database (VIDs will be auto-generated)
          for (const vehicleData of vehicles) {
            try {
              // Check if vehicle already exists (by brand, model, year)
              const existingVehicle = await Vehicle.findOne({
                where: {
                  brand: vehicleData.brand,
                  model: vehicleData.model,
                  year: vehicleData.year
                }
              });
              
              if (existingVehicle) {
                skipped++;
                continue;
              }
              
              await Vehicle.create(vehicleData);
              imported++;
            } catch (createError) {
              errors.push(`Failed to create vehicle ${vehicleData.brand} ${vehicleData.model}: ${createError.message}`);
              skipped++;
            }
          }
          
          // Update the CSV with all current vehicles
          await exportVehiclesToCSV();
          
          resolve({
            success: true,
            imported,
            skipped,
            errors,
            total: vehicles.length + skipped,
            message: `Successfully imported ${imported} vehicles. ${skipped} skipped.`
          });
        } catch (error) {
          reject(error);
        }
      })
      .on('error', (error) => {
        reject(error);
      });
  });
};

module.exports = {
  exportVehiclesToCSV,
  addVehicleToCSV,
  importVehiclesFromCSV,
  CSV_FILE_PATH
};

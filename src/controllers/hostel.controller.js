// const { Hostel } = require("../models/hostel.model");

// const getHostelById = async (req, res) => {
//   try {
//     const { id } = req.params;
//     console.log("🔍 Requested hostel ID:", id);

//     // Validate ID format
//     if (!id || id.length !== 24) {
//       console.log(" Invalid ID format");
//       return res.status(400).json({ success: false, message: "Invalid hostel ID format" });
//     }

//     const hostel = await Hostel.findById(id);
//     console.log(" Hostel found:", hostel);

//     if (!hostel) {
//       return res.status(404).json({ success: false, message: "Hostel not found" });
//     }

//     res.status(200).json({
//       success: true,
//       data: hostel,
//     });
//   } catch (error) {
//     console.error(" Error fetching hostel details:", error.message);
//     res.status(500).json({ success: false, message: "Internal server error" });
//   }
// };

// module.exports = { getHostelById };
const { Hostel } = require("../models/hostel.model");
const createHostels = async (req, res) => {
  try {
    const hostels = req.body; // expects an array of hostel objects

    if (!Array.isArray(hostels) || hostels.length === 0) {
      return res.status(400).json({ success: false, message: "Request body must be a non-empty array" });
    }

    // Validate each hostel's required fields (you can extend this)
    for (const hostel of hostels) {
      if (!hostel.ownerId || !hostel.name || !hostel.location?.type || !hostel.location?.coordinates || !hostel.contactNumber || !hostel.pricePerMonth) {
        return res.status(400).json({ success: false, message: "Missing required fields in one or more hostels." });
      }
    }

    const savedHostels = await Hostel.insertMany(hostels);

    res.status(201).json({
      success: true,
      message: `${savedHostels.length} hostels created successfully.`,
      data: savedHostels,
    });
  } catch (error) {
    console.error("Error creating hostels:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


// GET /api/hostel-profile/:id
const getHostelById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("🔍 Requested hostel ID:", id);

    if (!id || id.length !== 24) {
      return res.status(400).json({ success: false, message: "Invalid hostel ID format" });
    }

    const hostel = await Hostel.findById(id);
    if (!hostel) {
      return res.status(404).json({ success: false, message: "Hostel not found" });
    }

    res.status(200).json({ success: true, data: hostel });
  } catch (error) {
    console.error("Error fetching hostel details:", error.message);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// ✅ GET /api/hostel-profile
const getAllHostels = async (req, res) => {
  try {
    const hostels = await Hostel.find();
    res.status(200).json({ success: true, data: hostels });
  } catch (error) {
    console.error("Error fetching hostels:", error.message);
    res.status(500).json({ success: false, message: "Failed to retrieve hostels" });
  }
};

module.exports = { getHostelById, getAllHostels, createHostels };

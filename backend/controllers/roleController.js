import Role from "../models/Role.js";

// Get all roles
export const getRoles = async (req, res) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Create a new role
export const createRole = async (req, res) => {
  try {
    const { name, description, permissions } = req.body;
    const existingRole = await Role.findOne({ name });
    if (existingRole)
      return res.status(400).json({ message: "Role already exists" });

    const newRole = await Role.create({ name, description, permissions });
    res.status(201).json(newRole);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Update a role
export const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, permissions } = req.body;

    const role = await Role.findById(id);
    if (!role) return res.status(404).json({ message: "Role not found" });

    role.name = name || role.name;
    role.description = description || role.description;
    role.permissions = permissions || role.permissions;

    const updatedRole = await role.save();
    res.json(updatedRole);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Delete a role
export const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findByIdAndDelete(id);
    if (!role) return res.status(404).json({ message: "Role not found" });
    res.json({ message: "Role deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

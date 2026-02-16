import { useState, useEffect } from 'react';
import { BaseCrudService } from '@/integrations';
import { VendorDirectory } from '@/entities';
import { motion } from 'framer-motion';
import { Plus, Trash2, Edit2, X, Check, Phone, Mail } from 'lucide-react';
import { Image } from '@/components/ui/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function VendorsPage() {
  const [vendors, setVendors] = useState<VendorDirectory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [isAddingVendor, setIsAddingVendor] = useState(false);
  const [editingVendorId, setEditingVendorId] = useState<string | null>(null);
  const [newVendor, setNewVendor] = useState({
    vendorName: '',
    serviceType: '',
    description: '',
    phoneNumber: '',
    email: '',
    portfolioImage: 'https://static.wixstatic.com/media/8c86f3_01f4e4e74b344ef9b011aa2b2a5274fb~mv2.png?originWidth=384&originHeight=320'
  });

  useEffect(() => {
    loadVendors();
  }, []);

  const loadVendors = async () => {
    try {
      const result = await BaseCrudService.getAll<VendorDirectory>('vendordirectory');
      setVendors(result.items);
    } catch (error) {
      console.error('Error loading vendors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVendor = async () => {
    if (!newVendor.vendorName.trim() || !newVendor.serviceType.trim()) return;
    
    const vendorToAdd = {
      _id: crypto.randomUUID(),
      vendorName: newVendor.vendorName,
      serviceType: newVendor.serviceType,
      description: newVendor.description || undefined,
      phoneNumber: newVendor.phoneNumber || undefined,
      email: newVendor.email || undefined,
      portfolioImage: newVendor.portfolioImage
    };

    setVendors([vendorToAdd, ...vendors]);
    setIsAddingVendor(false);
    setNewVendor({
      vendorName: '',
      serviceType: '',
      description: '',
      phoneNumber: '',
      email: '',
      portfolioImage: 'https://static.wixstatic.com/media/8c86f3_f5478d379af44c09aa769027cb45f364~mv2.png?originWidth=384&originHeight=320'
    });

    try {
      await BaseCrudService.create('vendordirectory', vendorToAdd);
    } catch (error) {
      loadVendors();
    }
  };

  const handleDeleteVendor = async (vendorId: string) => {
    setVendors(vendors.filter(v => v._id !== vendorId));
    try {
      await BaseCrudService.delete('vendordirectory', vendorId);
    } catch (error) {
      loadVendors();
    }
  };

  const handleUpdateVendor = async (vendor: VendorDirectory) => {
    setVendors(vendors.map(v => v._id === vendor._id ? vendor : v));
    setEditingVendorId(null);
    try {
      await BaseCrudService.update('vendordirectory', vendor);
    } catch (error) {
      loadVendors();
    }
  };

  const serviceTypes = Array.from(new Set(vendors.map(v => v.serviceType).filter(Boolean)));
  
  const filteredVendors = filter === 'all' 
    ? vendors 
    : vendors.filter(v => v.serviceType === filter);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      
      <main className="flex-1 w-full max-w-[100rem] mx-auto px-8 md:px-16 lg:px-24 py-16">
        <div className="mb-12">
          <h1 className="font-heading text-5xl md:text-6xl text-primary mb-4">
            Vendor Directory
          </h1>
          <p className="font-paragraph text-lg text-primary/80">
            Connect with trusted wedding vendors and service providers
          </p>
        </div>

        {/* Filters and Add Button */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-2 font-paragraph text-base transition-colors duration-300 ${
                filter === 'all'
                  ? 'bg-primary text-primary-foreground'
                  : 'border-2 border-buttonborder text-primary hover:bg-primary hover:text-primary-foreground'
              }`}
            >
              All Vendors
            </button>
            {serviceTypes.map((type) => (
              <button
                key={type}
                onClick={() => setFilter(type!)}
                className={`px-6 py-2 font-paragraph text-base transition-colors duration-300 ${
                  filter === type
                    ? 'bg-primary text-primary-foreground'
                    : 'border-2 border-buttonborder text-primary hover:bg-primary hover:text-primary-foreground'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
          
          <button
            onClick={() => setIsAddingVendor(true)}
            className="px-6 py-2 bg-primary text-primary-foreground font-paragraph text-base hover:bg-primary/90 transition-colors duration-300 flex items-center gap-2"
          >
            <Plus size={20} />
            Add Vendor
          </button>
        </div>

        {/* Add Vendor Form */}
        {isAddingVendor && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-secondary p-6 mb-8"
          >
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              <input
                type="text"
                placeholder="Vendor name *"
                value={newVendor.vendorName}
                onChange={(e) => setNewVendor({ ...newVendor, vendorName: e.target.value })}
                className="px-4 py-3 bg-background border-2 border-buttonborder text-primary font-paragraph focus:outline-none focus:border-primary"
              />
              <input
                type="text"
                placeholder="Service type *"
                value={newVendor.serviceType}
                onChange={(e) => setNewVendor({ ...newVendor, serviceType: e.target.value })}
                className="px-4 py-3 bg-background border-2 border-buttonborder text-primary font-paragraph focus:outline-none focus:border-primary"
              />
              <input
                type="tel"
                placeholder="Phone number"
                value={newVendor.phoneNumber}
                onChange={(e) => setNewVendor({ ...newVendor, phoneNumber: e.target.value })}
                className="px-4 py-3 bg-background border-2 border-buttonborder text-primary font-paragraph focus:outline-none focus:border-primary"
              />
              <input
                type="email"
                placeholder="Email"
                value={newVendor.email}
                onChange={(e) => setNewVendor({ ...newVendor, email: e.target.value })}
                className="px-4 py-3 bg-background border-2 border-buttonborder text-primary font-paragraph focus:outline-none focus:border-primary"
              />
            </div>
            <textarea
              placeholder="Description"
              value={newVendor.description}
              onChange={(e) => setNewVendor({ ...newVendor, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 bg-background border-2 border-buttonborder text-primary font-paragraph focus:outline-none focus:border-primary mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={handleAddVendor}
                className="px-6 py-2 bg-primary text-primary-foreground font-paragraph text-base hover:bg-primary/90 transition-colors duration-300"
              >
                Add Vendor
              </button>
              <button
                onClick={() => {
                  setIsAddingVendor(false);
                  setNewVendor({
                    vendorName: '',
                    serviceType: '',
                    description: '',
                    phoneNumber: '',
                    email: '',
                    portfolioImage: 'https://static.wixstatic.com/media/8c86f3_f128323a89474043baa5039c5a0e2f33~mv2.png?originWidth=384&originHeight=320'
                  });
                }}
                className="px-6 py-2 border-2 border-buttonborder text-primary font-paragraph text-base hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
              >
                Cancel
              </button>
            </div>
          </motion.div>
        )}

        {/* Vendors Grid */}
        <div className="min-h-[400px]">
          {isLoading ? null : filteredVendors.length === 0 ? (
            <div className="text-center py-16">
              <p className="font-paragraph text-lg text-primary/60">
                {filter === 'all' ? 'No vendors yet. Add your first vendor to get started!' : `No vendors in ${filter} category.`}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVendors.map((vendor, index) => (
                <motion.div
                  key={vendor._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <VendorCard
                    vendor={vendor}
                    isEditing={editingVendorId === vendor._id}
                    onDelete={handleDeleteVendor}
                    onEdit={() => setEditingVendorId(vendor._id)}
                    onCancelEdit={() => setEditingVendorId(null)}
                    onUpdate={handleUpdateVendor}
                  />
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function VendorCard({
  vendor,
  isEditing,
  onDelete,
  onEdit,
  onCancelEdit,
  onUpdate
}: {
  vendor: VendorDirectory;
  isEditing: boolean;
  onDelete: (id: string) => void;
  onEdit: () => void;
  onCancelEdit: () => void;
  onUpdate: (vendor: VendorDirectory) => void;
}) {
  const [editedVendor, setEditedVendor] = useState(vendor);

  if (isEditing) {
    return (
      <div className="bg-secondary p-6">
        <div className="space-y-4 mb-4">
          <input
            type="text"
            value={editedVendor.vendorName || ''}
            onChange={(e) => setEditedVendor({ ...editedVendor, vendorName: e.target.value })}
            className="w-full px-4 py-3 bg-background border-2 border-buttonborder text-primary font-paragraph focus:outline-none focus:border-primary"
          />
          <input
            type="text"
            value={editedVendor.serviceType || ''}
            onChange={(e) => setEditedVendor({ ...editedVendor, serviceType: e.target.value })}
            className="w-full px-4 py-3 bg-background border-2 border-buttonborder text-primary font-paragraph focus:outline-none focus:border-primary"
          />
          <input
            type="tel"
            value={editedVendor.phoneNumber || ''}
            onChange={(e) => setEditedVendor({ ...editedVendor, phoneNumber: e.target.value })}
            placeholder="Phone"
            className="w-full px-4 py-3 bg-background border-2 border-buttonborder text-primary font-paragraph focus:outline-none focus:border-primary"
          />
          <input
            type="email"
            value={editedVendor.email || ''}
            onChange={(e) => setEditedVendor({ ...editedVendor, email: e.target.value })}
            placeholder="Email"
            className="w-full px-4 py-3 bg-background border-2 border-buttonborder text-primary font-paragraph focus:outline-none focus:border-primary"
          />
          <textarea
            value={editedVendor.description || ''}
            onChange={(e) => setEditedVendor({ ...editedVendor, description: e.target.value })}
            placeholder="Description"
            rows={3}
            className="w-full px-4 py-3 bg-background border-2 border-buttonborder text-primary font-paragraph focus:outline-none focus:border-primary"
          />
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => onUpdate(editedVendor)}
            className="px-4 py-2 bg-primary text-primary-foreground font-paragraph text-sm hover:bg-primary/90 transition-colors duration-300 flex items-center gap-2"
          >
            <Check size={16} />
            Save
          </button>
          <button
            onClick={onCancelEdit}
            className="px-4 py-2 border-2 border-buttonborder text-primary font-paragraph text-sm hover:bg-primary hover:text-primary-foreground transition-colors duration-300 flex items-center gap-2"
          >
            <X size={16} />
            Cancel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white overflow-hidden flex flex-col h-full">
      {vendor.portfolioImage && (
        <div className="w-full h-48 overflow-hidden">
          <Image
            src={vendor.portfolioImage}
            alt={`${vendor.vendorName} portfolio`}
            width={400}
            className="w-full h-full object-cover"
          />
        </div>
      )}
      
      <div className="p-6 flex-1 flex flex-col">
        <div className="mb-2">
          <span className="px-3 py-1 bg-secondary text-primary font-paragraph text-xs">
            {vendor.serviceType}
          </span>
        </div>
        
        <h3 className="font-heading text-2xl text-primary mb-3">
          {vendor.vendorName}
        </h3>
        
        {vendor.description && (
          <p className="font-paragraph text-base text-primary/70 mb-4 flex-1">
            {vendor.description}
          </p>
        )}
        
        <div className="space-y-2 mb-4">
          {vendor.phoneNumber && (
            <a 
              href={`tel:${vendor.phoneNumber}`}
              className="flex items-center gap-2 font-paragraph text-sm text-linkcolor hover:text-primary transition-colors duration-300"
            >
              <Phone size={14} />
              {vendor.phoneNumber}
            </a>
          )}
          {vendor.email && (
            <a 
              href={`mailto:${vendor.email}`}
              className="flex items-center gap-2 font-paragraph text-sm text-linkcolor hover:text-primary transition-colors duration-300"
            >
              <Mail size={14} />
              {vendor.email}
            </a>
          )}
        </div>

        <div className="flex gap-2 pt-4 border-t border-primary/10">
          <button
            onClick={onEdit}
            className="flex-1 px-4 py-2 border-2 border-buttonborder text-primary font-paragraph text-sm hover:bg-primary hover:text-primary-foreground transition-colors duration-300 flex items-center justify-center gap-2"
          >
            <Edit2 size={14} />
            Edit
          </button>
          <button
            onClick={() => onDelete(vendor._id)}
            className="px-4 py-2 text-destructive hover:bg-destructive/10 transition-colors duration-300"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}

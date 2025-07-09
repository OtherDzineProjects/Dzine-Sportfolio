import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Edit, Save, X } from "lucide-react";
import { PersonalProfile } from "@shared/profile-types";
import { KERALA_DISTRICTS } from "@/lib/kerala-sports";

// Indian states list
const INDIAN_STATES = [
  "Kerala", "Tamil Nadu", "Karnataka", "Andhra Pradesh", "Telangana", "Goa", "Maharashtra", "Gujarat", "Rajasthan", "Haryana", "Punjab", "Himachal Pradesh", "Uttarakhand", "Uttar Pradesh", "Bihar", "West Bengal", "Jharkhand", "Odisha", "Chhattisgarh", "Madhya Pradesh", "Assam", "Meghalaya", "Manipur", "Mizoram", "Nagaland", "Tripura", "Arunachal Pradesh", "Sikkim", "Delhi", "Puducherry", "Chandigarh", "Jammu and Kashmir", "Ladakh"
];

// Kerala LSGD data
const KERALA_LSGD: Record<string, string[]> = {
  "Thiruvananthapuram": ["Thiruvananthapuram Corporation", "Neyyattinkara Municipality", "Attingal Municipality", "Varkala Municipality", "Kazhakoottam", "Pappanamcode", "Ulloor", "Peyad", "Powdikonam", "Karakulam", "Venjaramoodu", "Balaramapuram", "Kilimanoor", "Parassala", "Karode", "Kallambalam", "Vilappilsala", "Mangalapuram", "Aruvikkara", "Navaikkarakunnu"],
  "Kollam": ["Kollam Corporation", "Paravoor Municipality", "Karunagappally Municipality", "Punalur Municipality", "Anchal", "Kunnathur", "Sasthamcotta", "Kundara", "Kottarakkara", "Pathanapuram", "Chadayamangalam", "Clappana", "Mayyanad", "Thrikkadavoor", "Kulakkada", "Perinad", "Panmana", "Chavara", "Oachira", "Nilamel"],
  "Pathanamthitta": ["Pathanamthitta Municipality", "Adoor Municipality", "Tiruvalla Municipality", "Pandalam Municipality", "Kozhenchery", "Ranni", "Mallappally", "Kuttanad", "Cherukolpuzha", "Konni", "Aranmula", "Omallur", "Elanthoor", "Eraviperoor", "Peringara", "Naranammoozhy", "Koipram", "Thumpamon", "Ayiroor", "Pulikeezhu"],
  "Alappuzha": ["Alappuzha Municipality", "Cherthala Municipality", "Kayamkulam Municipality", "Mavelikkara Municipality", "Haripad Municipality", "Chengannur Municipality", "Kuttanad", "Karthikappally", "Ambalappuzha", "Bharanikavu", "Budhanoor", "Champakkulam", "Devikulangara", "Edathua", "Harippad", "Kadakkarappally", "Kandalloor", "Karuvatta", "Kavalam", "Krishnapuram"],
  "Kottayam": ["Kottayam Municipality", "Changanassery Municipality", "Vaikom Municipality", "Palai Municipality", "Ettumanoor Municipality", "Erattupetta Municipality", "Pampady", "Kaduthuruthy", "Kanjirappally", "Mundakayam", "Lalam", "Madappally", "Aymanam", "Bharananganam", "Chempu", "Chirakkadavu", "Elikulam", "Erumely", "Koruthodu", "Kumarakom"],
  "Idukki": ["Thodupuzha Municipality", "Kattappana Municipality", "Munnar", "Devikulam", "Udumbanchola", "Peerumedu", "Kumily", "Vandanmedu", "Santhanpara", "Rajakumari", "Nedumkandam", "Kamakshy", "Vazhathope", "Vattavada", "Mankulam", "Kanjikuzhy", "Karunapuram", "Keerithodu", "Senapathy", "Upputhara"],
  "Ernakulam": ["Kochi Corporation", "Aluva Municipality", "Thrippunithura Municipality", "Kalamassery Municipality", "Angamaly Municipality", "Perumbavoor Municipality", "Kothamangalam Municipality", "Muvattupuzha Municipality", "North Paravur Municipality", "Eloor Municipality", "Kizhakkambalam", "Kunnathunad", "Kuttampuzha", "Karukutty", "Kalady", "Keerampara", "Keezhmad", "Kumbakonam", "Manjalloor", "Maneed"],
  "Thrissur": ["Thrissur Corporation", "Chalakudy Municipality", "Kodungallur Municipality", "Irinjalakuda Municipality", "Kunnamkulam Municipality", "Guruvayoor Municipality", "Chavakkad Municipality", "Wadakkanchery Municipality", "Ollur Municipality", "Anthikad", "Avinissery", "Eriyad", "Kadangodu", "Kadavallur", "Kadukutty", "Kaiparambu", "Kaipparambu", "Karalam", "Kattur", "Kattoor"],
  "Palakkad": ["Palakkad Municipality", "Ottapalam Municipality", "Shoranur Municipality", "Cherpulassery Municipality", "Pattambi Municipality", "Mannarkkad Municipality", "Chittur-Thathamangalam Municipality", "Sreekrishnapuram", "Kuzhalmannam", "Thrithala", "Kollengode", "Nemmara", "Ayilur", "Elavanchery", "Eruthenpathy", "Kanhangad", "Kappur", "Karimpuzha", "Kongad", "Koottanad"],
  "Malappuram": ["Malappuram Municipality", "Manjeri Municipality", "Perinthalmanna Municipality", "Tirur Municipality", "Tanur Municipality", "Kottakkal Municipality", "Ponnani Municipality", "Nilambur Municipality", "Kondotty Municipality", "Valanchery Municipality", "Areekode", "Edarikkode", "Edavanna", "Irimbiliyam", "Kalikavu", "Karulai", "Keezhattur", "Kuruva", "Malappuram", "Mankada"],
  "Kozhikode": ["Kozhikode Corporation", "Vadakara Municipality", "Koyilandy Municipality", "Feroke Municipality", "Ramanattukara Municipality", "Thamarassery Municipality", "Koduvally Municipality", "Mukkam Municipality", "Thiruvambady", "Kakkayam", "Koorachund", "Kuttiadi", "Nadapuram", "Omassery", "Panthalayani", "Payyoli", "Perambra", "Quilandy", "Thodannur", "Ulliyeri"],
  "Wayanad": ["Kalpetta Municipality", "Mananthavady Municipality", "Sulthan Bathery Municipality", "Vythiri", "Meppadi", "Ambalavayal", "Edavaka", "Kalpetta", "Kaniyambetta", "Karapuzha", "Krishnagiri", "Kunnathidavaka", "Meenangadi", "Mullankolly", "Muttil", "Nenmeni", "Noolpuzha", "Padinjarethara", "Pozhuthana", "Pulpally"],
  "Kannur": ["Kannur Corporation", "Thalassery Municipality", "Payyanur Municipality", "Mattannur Municipality", "Koothuparamba Municipality", "Anthoor Municipality", "Iritty Municipality", "Kuthuparamba Municipality", "Alakode", "Alakkode", "Aralam", "Ayyankunnu", "Chapparapadavu", "Cherukunnu", "Chirakkal", "Dharmadam", "Edakkad", "Eranholi", "Kadannappally", "Kadirur"],
  "Kasaragod": ["Kasaragod Municipality", "Kanhangad Municipality", "Nileshwar Municipality", "Uppala Municipality", "Adoor", "Balal", "Bedadka", "Bellur", "Chemnad", "Cherkala", "Delampady", "Hosdurg", "Karadka", "Kasaragod", "Kumbdaje", "Madhur", "Manjeshwar", "Mogral Puthur", "Mulleria", "Panayal"]
};
import { formatDateToDDMMYYYY, formatDateForInput } from "@/utils/date-format";

interface PersonalProfileSectionProps {
  profile: Partial<PersonalProfile>;
  onUpdate: (updates: Partial<PersonalProfile>) => void;
  isLoading?: boolean;
}

export function PersonalProfileSection({ profile, onUpdate, isLoading }: PersonalProfileSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<PersonalProfile>>(profile);

  const handleSave = () => {
    onUpdate(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(profile);
    setIsEditing(false);
  };

  const isKerala = formData.state === 'Kerala';
  const selectedDistrict = formData.district;
  const availableLSGDs = selectedDistrict ? KERALA_LSGD[selectedDistrict] || [] : [];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center space-x-2">
          <User className="h-5 w-5 text-blue-600" />
          <div>
            <CardTitle>Personal Profile</CardTitle>
            <CardDescription>Basic information and family details</CardDescription>
          </div>
        </div>
        {!isEditing ? (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
        ) : (
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleCancel}>
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave} disabled={isLoading}>
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={formData.firstName || ''}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={formData.lastName || ''}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              value={formData.phone || ''}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={!isEditing}
            />
          </div>
          <div>
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            {isEditing ? (
              <Input
                id="dateOfBirth"
                type="date"
                value={formatDateForInput(formData.dateOfBirth)}
                onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                disabled={!isEditing}
              />
            ) : (
              <Input
                id="dateOfBirth"
                value={formData.dateOfBirth ? formatDateToDDMMYYYY(formData.dateOfBirth) : ''}
                disabled={true}
                placeholder="DD/MM/YYYY"
              />
            )}
          </div>
        </div>

        {/* Address Information */}
        <div className="space-y-4">
          <h4 className="font-medium">Address Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                value={formData.address || ''}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="state">State</Label>
              <Select
                value={formData.state || ''}
                onValueChange={(value) => {
                  setFormData({ 
                    ...formData, 
                    state: value,
                    district: value === 'Kerala' ? formData.district : '',
                    lsgd: value === 'Kerala' ? formData.lsgd : '',
                    city: value !== 'Kerala' ? formData.city : ''
                  });
                }}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select state" />
                </SelectTrigger>
                <SelectContent>
                  {INDIAN_STATES.map((state) => (
                    <SelectItem key={state} value={state}>{state}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            {isKerala ? (
              <>
                <div>
                  <Label htmlFor="district">District</Label>
                  <Select
                    value={formData.district || ''}
                    onValueChange={(value) => {
                      setFormData({ ...formData, district: value, lsgd: '' });
                    }}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select district" />
                    </SelectTrigger>
                    <SelectContent>
                      {KERALA_DISTRICTS.map((district) => (
                        <SelectItem key={district} value={district}>{district}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {selectedDistrict && (
                  <div>
                    <Label htmlFor="lsgd">Ward/Corporation/Municipality</Label>
                    <Select
                      value={formData.lsgd || ''}
                      onValueChange={(value) => setFormData({ ...formData, lsgd: value })}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select LSGD" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableLSGDs.map((lsgd) => (
                          <SelectItem key={lsgd} value={lsgd}>{lsgd}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </>
            ) : (
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  value={formData.city || ''}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            )}
            
            <div>
              <Label htmlFor="pincode">PIN Code</Label>
              <Input
                id="pincode"
                value={formData.pincode || ''}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Family Information */}
        <div className="space-y-4">
          <h4 className="font-medium">Family Information</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="fatherName">Father's Name</Label>
              <Input
                id="fatherName"
                value={formData.fatherName || ''}
                onChange={(e) => setFormData({ ...formData, fatherName: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="motherName">Mother's Name</Label>
              <Input
                id="motherName"
                value={formData.motherName || ''}
                onChange={(e) => setFormData({ ...formData, motherName: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="fatherOccupation">Father's Occupation</Label>
              <Input
                id="fatherOccupation"
                value={formData.fatherOccupation || ''}
                onChange={(e) => setFormData({ ...formData, fatherOccupation: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="motherOccupation">Mother's Occupation</Label>
              <Input
                id="motherOccupation"
                value={formData.motherOccupation || ''}
                onChange={(e) => setFormData({ ...formData, motherOccupation: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        <div className="space-y-4">
          <h4 className="font-medium">Emergency Contact</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="emergencyContact">Emergency Contact Number</Label>
              <Input
                id="emergencyContact"
                value={formData.emergencyContact || ''}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <Label htmlFor="emergencyContactRelation">Relationship</Label>
              <Select
                value={formData.emergencyContactRelation || ''}
                onValueChange={(value) => setFormData({ ...formData, emergencyContactRelation: value })}
                disabled={!isEditing}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select relationship" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="father">Father</SelectItem>
                  <SelectItem value="mother">Mother</SelectItem>
                  <SelectItem value="spouse">Spouse</SelectItem>
                  <SelectItem value="sibling">Sibling</SelectItem>
                  <SelectItem value="friend">Friend</SelectItem>
                  <SelectItem value="guardian">Guardian</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
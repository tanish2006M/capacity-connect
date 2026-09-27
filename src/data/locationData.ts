/**
 * Capacity Connect - Official Geographic & Administrative Location Directory
 * Standard Indian States and Districts for Public Administration & Organizational Reporting
 */

export interface StateDistrictMap {
  state: string;
  districts: string[];
}

export const INDIAN_STATES_DISTRICTS: StateDistrictMap[] = [
  {
    state: 'Telangana',
    districts: [
      'Hyderabad',
      'Warangal',
      'Rangareddy',
      'Medchal-Malkajgiri',
      'Karimnagar',
      'Nizamabad',
      'Khammam',
      'Nalgonda',
      'Mahabubnagar',
      'Sangareddy',
      'Siddipet',
      'Adilabad',
    ],
  },
  {
    state: 'Maharashtra',
    districts: [
      'Mumbai City',
      'Mumbai Suburban',
      'Pune',
      'Nagpur',
      'Thane',
      'Nashik',
      'Aurangabad (Chhatrapati Sambhajinagar)',
      'Solapur',
      'Kolhapur',
      'Amravati',
      'Jalgaon',
      'Nanded',
      'Satara',
    ],
  },
  {
    state: 'Karnataka',
    districts: [
      'Bengaluru Urban',
      'Bengaluru Rural',
      'Mysuru',
      'Dharwad (Hubballi-Dharwad)',
      'Dakshina Kannada (Mangaluru)',
      'Belagavi',
      'Kalaburagi',
      'Ballari',
      'Shivamogga',
      'Tumakuru',
      'Udupi',
      'Hassan',
    ],
  },
  {
    state: 'Jharkhand',
    districts: [
      'Ranchi',
      'East Singhbhum (Jamshedpur)',
      'Dhanbad',
      'Bokaro',
      'Hazaribagh',
      'Deoghar',
      'Giridih',
      'Ramgarh',
      'Dumka',
      'Palamu',
    ],
  },
  {
    state: 'Delhi (NCT)',
    districts: [
      'New Delhi',
      'Central Delhi',
      'South Delhi',
      'North Delhi',
      'East Delhi',
      'West Delhi',
      'South West Delhi',
      'North West Delhi',
      'North East Delhi',
      'Shahdara',
    ],
  },
  {
    state: 'Tamil Nadu',
    districts: [
      'Chennai',
      'Coimbatore',
      'Madurai',
      'Tiruchirappalli',
      'Salem',
      'Tirunelveli',
      'Erode',
      'Vellore',
      'Thanjavur',
      'Kanchipuram',
      'Chengalpattu',
    ],
  },
  {
    state: 'Gujarat',
    districts: [
      'Ahmedabad',
      'Surat',
      'Vadodara',
      'Rajkot',
      'Bhavnagar',
      'Gandhinagar',
      'Jamnagar',
      'Junagadh',
      'Anand',
      'Kutch',
    ],
  },
  {
    state: 'Uttar Pradesh',
    districts: [
      'Lucknow',
      'Gautam Buddha Nagar (Noida)',
      'Kanpur Nagar',
      'Varanasi',
      'Prayagraj',
      'Agra',
      'Ghaziabad',
      'Meerut',
      'Bareilly',
      'Aligarh',
      'Gorakhpur',
    ],
  },
  {
    state: 'West Bengal',
    districts: [
      'Kolkata',
      'North 24 Parganas',
      'South 24 Parganas',
      'Howrah',
      'Hooghly',
      'Paschim Bardhaman (Durgapur/Asansol)',
      'Purba Bardhaman',
      'Darjeeling',
      'Nadia',
      'Murshidabad',
    ],
  },
  {
    state: 'Andhra Pradesh',
    districts: [
      'Visakhapatnam',
      'NTR District (Vijayawada)',
      'Guntur',
      'Tirupati',
      'Kurnool',
      'Nellore',
      'Anantapur',
      'Kakinada',
      'YSR Kadapa',
      'Vizianagaram',
    ],
  },
  {
    state: 'Rajasthan',
    districts: [
      'Jaipur',
      'Jodhpur',
      'Udaipur',
      'Kota',
      'Bikaner',
      'Ajmer',
      'Bhilwara',
      'Alwar',
      'Sikar',
      'Bharatpur',
    ],
  },
  {
    state: 'Kerala',
    districts: [
      'Thiruvananthapuram',
      'Ernakulam (Kochi)',
      'Kozhikode',
      'Thrissur',
      'Kollam',
      'Kannur',
      'Alappuzha',
      'Kottayam',
      'Palakkad',
      'Malappuram',
    ],
  },
  {
    state: 'Madhya Pradesh',
    districts: [
      'Bhopal',
      'Indore',
      'Gwalior',
      'Jabalpur',
      'Ujjain',
      'Sagar',
      'Rewa',
      'Satna',
      'Ratlam',
    ],
  },
  {
    state: 'Odisha',
    districts: [
      'Khordha (Bhubaneswar)',
      'Cuttack',
      'Sundargarh (Rourkela)',
      'Ganjam',
      'Puri',
      'Sambalpur',
      'Balasore',
      'Bhadrak',
    ],
  },
  {
    state: 'Punjab',
    districts: [
      'SAS Nagar (Mohali)',
      'Ludhiana',
      'Amritsar',
      'Jalandhar',
      'Patiala',
      'Bathinda',
      'Hoshiarpur',
    ],
  },
  {
    state: 'Haryana',
    districts: [
      'Gurugram',
      'Faridabad',
      'Panchkula',
      'Panipat',
      'Ambala',
      'Karnal',
      'Rohtak',
      'Hisar',
    ],
  },
  {
    state: 'Assam',
    districts: [
      'Kamrup Metropolitan (Guwahati)',
      'Dibrugarh',
      'Silchar (Cachar)',
      'Jorhat',
      'Nagaon',
      'Tezpur (Sonitpur)',
    ],
  },
  {
    state: 'Bihar',
    districts: [
      'Patna',
      'Gaya',
      'Bhagalpur',
      'Muzaffarpur',
      'Purnia',
      'Darbhanga',
      'Nalanda',
    ],
  },
  {
    state: 'Himachal Pradesh',
    districts: ['Shimla', 'Kangra (Dharamshala)', 'Mandi', 'Solan', 'Kullu'],
  },
  {
    state: 'Uttarakhand',
    districts: ['Dehradun', 'Haridwar', 'Nainital', 'Udham Singh Nagar'],
  },
];

export const ALL_STATES = INDIAN_STATES_DISTRICTS.map((s) => s.state);

export function getDistrictsForState(stateName: string): string[] {
  const match = INDIAN_STATES_DISTRICTS.find(
    (s) => s.state.toLowerCase() === stateName.toLowerCase()
  );
  return match ? match.districts : [];
}

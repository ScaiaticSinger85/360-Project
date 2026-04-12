const CATEGORY_IMAGES: Record<string, string> = {
  'Music':           'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80',
  'Food & Drink':    'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80',
  'Sports & Fitness':'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&q=80',
  'Arts & Culture':  'https://images.unsplash.com/photo-1578926375605-eaf7559b1458?w=800&q=80',
  'Technology':      'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
  'Community':       'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&q=80',
  'Networking':      'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80',
  'Business':        'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&q=80',
  'Art':             'https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b?w=800&q=80',
  'Sports':          'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80',
  'Health':          'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&q=80',
  'Party':           'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=80',
  'Education':       'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800&q=80',
  'Social':          'https://images.unsplash.com/photo-1543807535-eceef0bc6599?w=800&q=80',
  'Tech':            'https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80',
};

const DEFAULT_IMAGE = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&q=80';

export function getCategoryImage(category: string): string {
  return CATEGORY_IMAGES[category] || DEFAULT_IMAGE;
}

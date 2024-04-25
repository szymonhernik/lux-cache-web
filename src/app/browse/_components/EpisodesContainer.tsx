import Image from 'next/image';
import Link from 'next/link';

import GridTanstack from './GridTanstack';
import GridTanstackWrapper from './GridTanstackWrapper';

const mockUrls = [
  'https://placeholder.pics/svg/400x400/FFFFFF-F2F2F2/FFFFFF',
  'https://placeholder.pics/svg/400x400/FFFFFF-F2F2F2/FFFFFF',
  'https://placeholder.pics/svg/400x400/FFFFFF-F2F2F2/FFFFFF',
  'https://placeholder.pics/svg/400x400/FFFFFF-F2F2F2/FFFFFF',
  'https://placeholder.pics/svg/400x400/FFFFFF-F2F2F2/FFFFFF',
  'https://placeholder.pics/svg/400x400/FFFFFF-F2F2F2/FFFFFF',
  'https://placeholder.pics/svg/400x400/FFFFFF-F2F2F2/FFFFFF',
  'https://placeholder.pics/svg/400x400/FFFFFF-F2F2F2/FFFFFF'
];

const mockImages = mockUrls.map((url, index) => ({
  id: index + 1,
  url
}));

export default function EpisodesContainer() {
  return (
    <section className="lg:max-h-[100vh]  lg:overflow-y-hidden lg:overflow-x-auto  ">
      <div className="flex flex-col flex-wrap gap-0 h-[100vh] content-start">
        <GridTanstackWrapper>
          <GridTanstack />
        </GridTanstackWrapper>
        {/* {mockImages.map((image, i) => {
          console.log('image.url', image.url);

          return (
            <div
              className={`h-[calc(50vh-7rem)] w-[calc(50vh-7rem)] min-h-48 min-w-48 aspect-square bg-gradient-to-br from-lime-200 to-lime-0 flex justify-center items-center`}
            >
              {i + 1}
            </div>
          );
        })} */}
      </div>
    </section>
  );
}

// <Image
//   className="h-[50vh] w-auto object-cover"
//   key={image.id}
//   src={image.url}
//   alt=""
//   width={400}
//   height={400}
// />

import { Tab } from '@headlessui/react'

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const ImageGallery = ({ photo }) => {
  // 1. Construimos la URL completa usando la variable de entorno
  //    Si 'photo' existe, le anteponemos la VITE_API_URL.
  //    Si no, dejamos la cadena vacía.
  const imageUrl = photo ? `${import.meta.env.VITE_API_URL}${photo}` : '';

  return (
    <Tab.Group as="div" className="flex flex-col-reverse">
      <div className="hidden mt-6 w-full max-w-2xl mx-auto sm:block lg:max-w-none">
        <Tab.List className="grid grid-cols-4 gap-6">
          {/* Usamos 'photo' para la condición, para saber si hay imagen */}
          {photo && (
            <Tab
              className="relative h-24 bg-white rounded-md flex items-center justify-center text-sm font-medium uppercase text-gray-900 cursor-pointer hover:bg-gray-50 focus:outline-none focus:ring focus:ring-offset-4 focus:ring-opacity-50"
            >
              {({ selected }) => (
                <>
                  <span className="absolute inset-0 rounded-md overflow-hidden">
                    {/* 2. Aquí usamos la URL completa que construimos */}
                    <img src={imageUrl} alt="Product" className="w-full h-full object-center object-cover" />
                  </span>
                  <span
                    className={classNames(
                      selected ? 'ring-indigo-500' : 'ring-transparent',
                      'absolute inset-0 rounded-md ring-2 ring-offset-2 pointer-events-none'
                    )}
                    aria-hidden="true"
                  />
                </>
              )}
            </Tab>
          )}
        </Tab.List>
      </div>

      <Tab.Panels className="w-full aspect-w-1 aspect-h-1">
        {photo && (
          <Tab.Panel>
            {/* 3. Y también la usamos aquí en la imagen principal */}
            <img
              src={imageUrl}
              alt="Product"
              className="w-full h-full object-center object-cover sm:rounded-lg"
            />
          </Tab.Panel>
        )}
      </Tab.Panels>
    </Tab.Group>
  )
}

export default ImageGallery;
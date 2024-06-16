'use client';

import ArrowButton from '@components/ArrowButton';
import FormGroup from '@components/FormGroup';
import Loader from '@components/ui/loader';
import { useQuery } from '@tanstack/react-query';
import { Plus, Save } from 'lucide-react';
import { useRef, useState } from 'react';

type LocationData = {
	name: string;
};

export default function InformationSettings({
	locationId,
}: {
	locationId: string;
}) {
	// const locationNameInputRef = useRef<HTMLInputElement>(null);
	const [locationName, setLocationName] = useState('');
	const {
		data,
		isLoading,
	}: { data: LocationData | undefined; isLoading: boolean } = useQuery({
		queryKey: ['locations', locationId],
		queryFn: async () => {
			const res = await fetch(`/api/locations?id=${locationId}&single=true`);
			if (res.ok) {
				const json: { locations: LocationData } = await res.json();
				setLocationName(json?.locations.name);
				return json.locations;
			}
		},
	});

	return (
		<>
			<div className='max-w-md'>
				{isLoading ? (
					<Loader className='w-8 h-8 text-primary' />
				) : (
					<FormGroup
						label='Location Name'
						value={locationName}
						vertical
						onChange={(e) => setLocationName(e.target.value)}
					/>
				)}
			</div>
			<ArrowButton
				className='mt-8'
				Icon={Save}
				isLoading={isLoading}
				disabled={isLoading || data?.name === locationName}
				variant='primary'
			>
				Save
			</ArrowButton>
		</>
	);
}
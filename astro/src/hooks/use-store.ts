import { create } from "zustand";

type Fetcher<T> = () => Promise<T>;

interface StoreEntry<T> {
	data: T;
	fetcher?: Fetcher<T>;
	isFetching: boolean;
}

interface Cache {
	// biome-ignore lint/suspicious/noExplicitAny: <type has to be lenient to store different types of data>
	[key: string]: StoreEntry<any>;
}

interface Store {
	cache: Cache;
	set: <T>(key: string, data: T, fetcher?: Fetcher<T>) => void;
	revalidate: (key: string) => Promise<void>;
	refetch: <T>(key: string, fetcher: Fetcher<T>) => Promise<void>;
}

export const useStore = create<Store>((set, get) => ({
	cache: {},
	set: <T>(key: string, data: T, fetcher?: Fetcher<T>) => {
		set((state) => ({
			cache: {
				...state.cache,
				[key]: {
					...state.cache[key],
					data,
					fetcher,
					isFetching: false,
				},
			},
		}));
	},
	revalidate: async (key: string) => {
		const entry = get().cache[key];
		if (!entry?.fetcher) {
			console.warn(`No fetcher for key "${key}", cannot revalidate.`);
			return;
		}

		set((state) => ({
			cache: {
				...state.cache,
				[key]: { ...entry, isFetching: true },
			},
		}));

		try {
			const newData = await entry.fetcher();
			set((state) => ({
				cache: {
					...state.cache,
					[key]: { ...entry, data: newData, isFetching: false },
				},
			}));
		} catch (error) {
			console.error(`Failed to revalidate key "${key}":`, error);
			set((state) => ({
				cache: {
					...state.cache,
					[key]: { ...entry, isFetching: false },
				},
			}));
		}
	},
	refetch: async <T>(key: string, fetcher: Fetcher<T>) => {
		set((state) => ({
			cache: {
				...state.cache,
				[key]: { ...state.cache[key], isFetching: true },
			},
		}));

		try {
			const newData = await fetcher();
			console.log("Refetched data for key:", key, newData);
			set((state) => ({
				cache: {
					...state.cache,
					[key]: {
						...state.cache[key],
						data: newData,
						fetcher, // also update the fetcher
						isFetching: false,
					},
				},
			}));
		} catch (error) {
			console.error(`Failed to refetch key "${key}":`, error);
			set((state) => ({
				cache: {
					...state.cache,
					[key]: { ...state.cache[key], isFetching: false },
				},
			}));
		}
	},
}));

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SwapiService {
  private baseUrl = 'https://swapi.dev/api';
  private imageBaseUrl = 'https://starwars-databank-server.vercel.app/api/v1';
  private imageCache = new Map<string, string>(); // Adicione esta linha

  constructor(private http: HttpClient) {}

  // Personagens
  getCharacters(): Observable<any> {
    return this.http.get(`${this.baseUrl}/people/`);
  }

  getCharacter(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/people/${id}/`);
  }


  getVehicle(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/vehicles/${id}/`);
  }


  getCharacterImage(name: string): string {
    const characterImages: Record<string, string> = {
      'Luke Skywalker': 'https://lumiere-a.akamaihd.net/v1/images/luke-skywalker-main_fb34a1ff.jpeg',
      'C-3PO': 'https://lumiere-a.akamaihd.net/v1/images/c-3po-main_41714fe2.jpeg',
      'R2-D2': 'https://lumiere-a.akamaihd.net/v1/images/r2-d2-main_f315b094.jpeg',
      'Darth Vader': 'https://lumiere-a.akamaihd.net/v1/images/darth-vader-main_4560aff7.jpeg',
      'Leia Organa': 'https://lumiere-a.akamaihd.net/v1/images/leia-organa-feature-image_a0c7aafd.jpeg',
      'Obi-Wan Kenobi': 'https://lumiere-a.akamaihd.net/v1/images/obi-wan-kenobi-main_99a4b10c.jpeg',
      'Chewbacca': 'https://lumiere-a.akamaihd.net/v1/images/chewie-main_e25c518c.jpeg',
      'Han Solo': 'https://lumiere-a.akamaihd.net/v1/images/han-solo-main_a4c8ff79.jpeg',
      'Yoda': 'https://lumiere-a.akamaihd.net/v1/images/yoda-main_2d7ecc2b.jpeg',
      'Palpatine': 'https://lumiere-a.akamaihd.net/v1/images/emperor-palpatine_7df2b5b4.jpeg',
      'Boba Fett': 'https://lumiere-a.akamaihd.net/v1/images/boba-fett-main_cf5a7a2f.jpeg',
      'Lando Calrissian': 'https://lumiere-a.akamaihd.net/v1/images/lando-main_bf5bafea.jpeg',
      'default': 'https://lumiere-a.akamaihd.net/v1/images/databank_unknown_01_169_36c20a5f.jpeg'
    };

    return characterImages[name] || characterImages['default'];
  }


  private getFallbackImage(speciesName: string): string {
    const fallbackImages: { [key: string]: string } = {
      'human': 'https://lumiere-a.akamaihd.net/v1/images/anakin-skywalker-main_23e5105b.jpeg?region=387%2C27%2C1350%2C760',
      'droid': 'https://lumiere-a.akamaihd.net/v1/images/2-1b-droid-main-image_546a90ad.jpeg?region=0%2C107%2C1560%2C880',
      'wookiee': 'https://lumiere-a.akamaihd.net/v1/images/wookiees-main-b_fc850c5b.jpeg?region=8%2C0%2C1543%2C868',
      'rodian': 'https://lumiere-a.akamaihd.net/v1/images/rodian-main_de29c78f.jpeg?region=0%2C0%2C1280%2C721',
      'hutt': 'https://lumiere-a.akamaihd.net/v1/images/databank_hutt_01_169_5d0535d2.jpeg?region=0%2C0%2C1560%2C878',
      "yoda's species": 'https://lumiere-a.akamaihd.net/v1/images/Yoda-Retina_2a7ecc26.jpeg?region=0%2C0%2C1536%2C864',
      'trandoshan': 'https://lumiere-a.akamaihd.net/v1/images/trandoshian-main_19804be7.jpeg?region=0%2C67%2C1280%2C720',
      'mon calamari': 'https://lumiere-a.akamaihd.net/v1/images/databank_moncalamari_01_169_135967d9.jpeg?region=0%2C0%2C1560%2C878',
      'ewok': 'https://lumiere-a.akamaihd.net/v1/images/databank_ewok_01_169_747db03a.jpeg?region=0%2C0%2C1560%2C878',
      'gungan': 'https://lumiere-a.akamaihd.net/v1/images/ep1_ia_70138_bd7b9296.jpeg?region=0%2C0%2C3072%2C1732',
      'twi\'lek': 'https://lumiere-a.akamaihd.net/v1/images/twi-lek-main_93917d40.jpeg?region=93%2C0%2C951%2C536',
      'sullustan': 'https://lumiere-a.akamaihd.net/v1/images/databank_sullustan_01_169_01e4c3e0.jpeg?region=0%2C0%2C1560%2C878',
      'default': 'https://lumiere-a.akamaihd.net/v1/images/databank_unknown_01_169_36c20a5f.jpeg'
    };

    const lowerName = speciesName.toLowerCase();
    
    // Busca exata
    if (fallbackImages[lowerName]) {
      return fallbackImages[lowerName];
    }

    for (const [key, image] of Object.entries(fallbackImages)) {
      if (lowerName.includes(key) || key.includes(lowerName)) {
        return image;
      }
    }

    return fallbackImages['default'];
  }


getPlanets(page: number = 1) {
  return this.http.get<any>(`https://swapi.dev/api/planets/?page=${page}`);
}

getPlanetById(id: string): Observable<any> {
  return this.http.get(`${this.baseUrl}/planets/${id}/`);
}

getAllPlanetsImages(): Observable<any> {
  return this.http.get(`${this.imageBaseUrl}/planets`).pipe(
    catchError(() => of({ planets: [] }))
  );
}

getPlanetImage(planetName: string): Observable<string> {
  const cacheKey = `planet_${planetName}`;
  const cached = this.imageCache.get(cacheKey);
  if (cached) {
    return of(cached);
  }

  return this.getAllPlanetsImages().pipe(
    map(response => {
      const planetsList = response.planets || [];
      
      let foundPlanet = planetsList.find((p: any) => 
        p.name.toLowerCase() === planetName.toLowerCase()
      );

      if (!foundPlanet) {
        foundPlanet = planetsList.find((p: any) => 
          p.name.toLowerCase().includes(planetName.toLowerCase()) ||
          planetName.toLowerCase().includes(p.name.toLowerCase())
        );
      }

      if (foundPlanet && foundPlanet.image) {
        this.imageCache.set(cacheKey, foundPlanet.image);
        return foundPlanet.image;
      }

      const fallback = this.getPlanetFallbackImage(planetName);
      this.imageCache.set(cacheKey, fallback);
      return fallback;
    }),
    catchError(() => {
      const fallback = this.getPlanetFallbackImage(planetName);
      this.imageCache.set(cacheKey, fallback);
      return of(fallback);
    })
  );
}

private getPlanetFallbackImage(planetName: string): string {
  const fallbackImages: { [key: string]: string } = {
    'tatooine': 'https://lumiere-a.akamaihd.net/v1/images/tatooine-main_9542b896.jpeg?region=165%2C0%2C949%2C534',
    'alderaan': 'https://lumiere-a.akamaihd.net/v1/images/alderaan-main_f5b676cf.jpeg?region=0%2C0%2C1280%2C720',
    'yavin iv': 'https://lumiere-a.akamaihd.net/v1/images/yavin-4-main_bd23f447.jpeg?region=331%2C0%2C949%2C534',
    'hoth': 'https://lumiere-a.akamaihd.net/v1/images/Hoth_d074d307.jpeg?region=0%2C0%2C1200%2C675',
    'dagobah': 'https://lumiere-a.akamaihd.net/v1/images/Dagobah_890df592.jpeg?region=0%2C80%2C1260%2C711',
    'bespin': 'https://lumiere-a.akamaihd.net/v1/images/Bespin_2d0759aa.jpeg?region=0%2C0%2C1560%2C878',
    'endor': 'https://lumiere-a.akamaihd.net/v1/images/databank_endor_01_169_68ba9bdc.jpeg?region=0%2C0%2C1560%2C878',
    'naboo': 'https://lumiere-a.akamaihd.net/v1/images/databank_naboo_01_169_6cd7e1e0.jpeg?region=0%2C0%2C1560%2C878',
    'coruscant': 'https://lumiere-a.akamaihd.net/v1/images/coruscant-main_d2fad5f2.jpeg?region=245%2C0%2C1430%2C804',
    'kamino': 'https://lumiere-a.akamaihd.net/v1/images/kamino-main_3001369e.jpeg?region=158%2C0%2C964%2C542',
    'geonoisis': 'https://lumiere-a.akamaihd.net/v1/images/databank_geonosis_01_169_1d04e086.jpeg?region=0%2C0%2C1560%2C878',
    'utapau': 'https://lumiere-a.akamaihd.net/v1/images/databank_utapau_01_169_14a54eb1.jpeg?region=0%2C0%2C1560%2C878',
    'mustafar': 'https://lumiere-a.akamaihd.net/v1/images/databank_mustafar_01_169_5b470758.jpeg?region=0%2C0%2C1560%2C878',
    'kashyyyk': 'https://lumiere-a.akamaihd.net/v1/images/kashyyyk-main_37a2e497.jpeg?region=237%2C0%2C1445%2C813',
    'polis massa': 'https://lumiere-a.akamaihd.net/v1/images/databank_polismassa_01_169_21f04b76.jpeg?region=0%2C0%2C1560%2C878',
    'mygeeto': 'https://lumiere-a.akamaihd.net/v1/images/mygeeto-main-image_91c503cc.jpeg?region=49%2C0%2C1181%2C665',
    'felucia': 'https://lumiere-a.akamaihd.net/v1/images/databank_felucia_01_169_2070e38e.jpeg?region=0%2C0%2C1560%2C878',
    'cato neimoidia': 'https://lumiere-a.akamaihd.net/v1/images/databank_catoneimoidia_01_169_d2b9bb58.jpeg?region=0%2C0%2C1560%2C878',
    'default': 'https://lumiere-a.akamaihd.net/v1/images/databank_unknown_01_169_36c20a5f.jpeg'
  };

  const lowerName = planetName.toLowerCase();
  
  if (fallbackImages[lowerName]) {
    return fallbackImages[lowerName];
  }

  for (const [key, image] of Object.entries(fallbackImages)) {
    if (lowerName.includes(key) || key.includes(lowerName)) {
      return image;
    }
  }

  return fallbackImages['default'];
}

getPlanetImageSync(planetName: string): string {
  return this.getPlanetFallbackImage(planetName);
}


getVehicles(page: number = 1): Observable<any> {
  return this.http.get(`${this.baseUrl}/vehicles/?page=${page}`);
}

getVehicleById(id: string): Observable<any> {
  return this.http.get(`${this.baseUrl}/vehicles/${id}/`);
}

getAllVehiclesImages(): Observable<any> {
  return this.http.get(`${this.imageBaseUrl}/vehicles`).pipe(
    catchError(() => of({ vehicles: [] }))
  );
}

getVehicleImage(vehicleName: string): Observable<string> {
  const cacheKey = `vehicle_${vehicleName}`;
  const cached = this.imageCache.get(cacheKey);
  if (cached) {
    return of(cached);
  }

  return this.getAllVehiclesImages().pipe(
    map(response => {
      const vehiclesList = response.vehicles || [];
      
      let foundVehicle = vehiclesList.find((v: any) => 
        v.name.toLowerCase() === vehicleName.toLowerCase()
      );

      if (!foundVehicle) {
        foundVehicle = vehiclesList.find((v: any) => 
          v.name.toLowerCase().includes(vehicleName.toLowerCase()) ||
          vehicleName.toLowerCase().includes(v.name.toLowerCase())
        );
      }

      if (foundVehicle && foundVehicle.image) {
        this.imageCache.set(cacheKey, foundVehicle.image);
        return foundVehicle.image;
      }

      const fallback = this.getVehicleFallbackImage(vehicleName);
      this.imageCache.set(cacheKey, fallback);
      return fallback;
    }),
    catchError(() => {
      const fallback = this.getVehicleFallbackImage(vehicleName);
      this.imageCache.set(cacheKey, fallback);
      return of(fallback);
    })
  );
}

// Fallback images para veículos 
private getVehicleFallbackImage(vehicleName: string): string {
  const fallbackImages: { [key: string]: string } = {
    'sand crawler': 'https://lumiere-a.akamaihd.net/v1/images/sandcrawler-main_eb1b036b.jpeg?region=251%2C20%2C865%2C487',
    't-16 skyhopper': 'https://lumiere-a.akamaihd.net/v1/images/databank_t16skyhopper_01_169_ad69e901.jpeg?region=141%2C304%2C750%2C422',
    'x-34 landspeeder': 'https://lumiere-a.akamaihd.net/v1/images/E4D_IA_1136_6b8704fa.jpeg?region=237%2C0%2C1456%2C819',
    'tie/ln starfighter': 'https://lumiere-a.akamaihd.net/v1/images/TIE-Fighter_25397c64.jpeg?region=0%2C1%2C2048%2C1152',
    'snowspeeder': 'https://lumiere-a.akamaihd.net/v1/images/snowspeeder_ef2f9334.jpeg?region=0%2C211%2C2048%2C1154',
    'tie bomber': 'https://lumiere-a.akamaihd.net/v1/images/tie-bomber-main_d4d9b979.jpeg?region=424%2C0%2C632%2C356',
    'at-at': 'https://lumiere-a.akamaihd.net/v1/images/AT-AT_89d0105f.jpeg?region=214%2C19%2C1270%2C716',
    'at-st': 'https://lumiere-a.akamaihd.net/v1/images/e6d_ia_5724_a150e6d4.jpeg?region=124%2C0%2C1424%2C802',
    'storm iv twin-pod cloud car': 'https://lumiere-a.akamaihd.net/v1/images/cloud-car-main-image_8d2e4e89.jpeg?region=271%2C0%2C1009%2C568',
    'sail barge': 'https://lumiere-a.akamaihd.net/v1/images/5ab2780393e90900016590c5-image_463c9cf2.jpeg?region=0,0,1536,864',
    'tie/in interceptor': 'https://lumiere-a.akamaihd.net/v1/images/tie-interceptor-main_ec129295.jpeg?region=0%2C0%2C951%2C536',
    'imperial speeder bike': 'https://lumiere-a.akamaihd.net/v1/images/speeder-bike-main_7bda8b19.jpeg?region=0%2C0%2C951%2C536',
    'vulture droid': 'https://lumiere-a.akamaihd.net/v1/images/vulture-droid-main-image_9c8b0b0c.jpeg?region=0%2C0%2C951%2C536',
    'multi-troop transport': 'https://lumiere-a.akamaihd.net/v1/images/mtt-main-image_7d5c97c6.jpeg?region=0%2C0%2C951%2C536',
    'armored assault tank': 'https://lumiere-a.akamaihd.net/v1/images/a-a-t-main-image_5d5c9a6d.jpeg?region=0%2C0%2C951%2C536',
    'single trooper aerial platform': 'https://lumiere-a.akamaihd.net/v1/images/stap-main-image_5c6a9d3a.jpeg?region=0%2C0%2C951%2C536',
    'c-9979 landing craft': 'https://lumiere-a.akamaihd.net/v1/images/c-9979-main-image_5c6a9d3a.jpeg?region=0%2C0%2C951%2C536',
    'tribubble bongo': 'https://lumiere-a.akamaihd.net/v1/images/bongo-main-image_5c6a9d3a.jpeg?region=0%2C0%2C951%2C536',
    'naboo star skiff': 'https://lumiere-a.akamaihd.net/v1/images/naboo-star-skiff-main-image_5c6a9d3a.jpeg?region=0%2C0%2C951%2C536',
    'emergency firespeeder': 'https://lumiere-a.akamaihd.net/v1/images/firespeeder-main-image_5c6a9d3a.jpeg?region=0%2C0%2C951%2C536',
    'default': 'https://lumiere-a.akamaihd.net/v1/images/databank_unknown_01_169_36c20a5f.jpeg'
  };

  const lowerName = vehicleName.toLowerCase();
  
  if (fallbackImages[lowerName]) {
    return fallbackImages[lowerName];
  }

  for (const [key, image] of Object.entries(fallbackImages)) {
    if (lowerName.includes(key) || key.includes(lowerName)) {
      return image;
    }
  }

  return fallbackImages['default'];
}

getVehicleImageSync(vehicleName: string): string {
  return this.getVehicleFallbackImage(vehicleName);
}
// No seu SwapiService, adicione/atualize estes métodos:

// Métodos para Espécies
getSpecies(page: number = 1): Observable<any> {
  return this.http.get(`${this.baseUrl}/species/?page=${page}`);
}

getSpeciesById(id: string): Observable<any> {
  return this.http.get(`${this.baseUrl}/species/${id}/`);
}

// Busca todas as imagens de espécies da API
getAllSpeciesImages(): Observable<any> {
  return this.http.get(`${this.imageBaseUrl}/species`).pipe(
    catchError(() => of({ species: [] })) // Retorna array vazio em caso de erro
  );
}

// Método melhorado para buscar imagem da espécie
getSpeciesImage(speciesName: string): Observable<string> {
  // Se já temos no cache, retorna imediatamente
  const cached = this.imageCache.get(speciesName);
  if (cached) {
    return of(cached);
  }

  // Busca todas as espécies e filtra pelo nome
  return this.getAllSpeciesImages().pipe(
    map(response => {
      const speciesList = response.species || [];
      
      // Tenta encontrar correspondência exata
      let foundSpecie = speciesList.find((s: any) => 
        s.name.toLowerCase() === speciesName.toLowerCase()
      );

      // Se não encontrou, tenta correspondência parcial
      if (!foundSpecie) {
        foundSpecie = speciesList.find((s: any) => 
          s.name.toLowerCase().includes(speciesName.toLowerCase()) ||
          speciesName.toLowerCase().includes(s.name.toLowerCase())
        );
      }

      if (foundSpecie && foundSpecie.image) {
        // Cache a imagem encontrada
        this.imageCache.set(speciesName, foundSpecie.image);
        return foundSpecie.image;
      }

      // Fallback para imagem baseada no tipo
      const fallback = this.getSpeciesFallbackImage(speciesName);
      this.imageCache.set(speciesName, fallback);
      return fallback;
    }),
    catchError(() => {
      const fallback = this.getSpeciesFallbackImage(speciesName);
      this.imageCache.set(speciesName, fallback);
      return of(fallback);
    })
  );
}

// Fallback images para espécies - ATUALIZADO COM MAIS ESPÉCIES
private getSpeciesFallbackImage(speciesName: string): string {
  const fallbackImages: { [key: string]: string } = {
    'human': 'https://lumiere-a.akamaihd.net/v1/images/anakin-skywalker-main_23e5105b.jpeg?region=387%2C27%2C1350%2C760',
    'droid': 'https://lumiere-a.akamaihd.net/v1/images/2-1b-droid-main-image_546a90ad.jpeg?region=0%2C107%2C1560%2C880',
    'wookiee': 'https://lumiere-a.akamaihd.net/v1/images/wookiees-main-b_fc850c5b.jpeg?region=8%2C0%2C1543%2C868',
    'rodian': 'https://lumiere-a.akamaihd.net/v1/images/rodian-main_de29c78f.jpeg?region=0%2C0%2C1280%2C721',
    'hutt': 'https://lumiere-a.akamaihd.net/v1/images/databank_hutt_01_169_5d0535d2.jpeg?region=0%2C0%2C1560%2C878',
    "yoda's species": 'https://lumiere-a.akamaihd.net/v1/images/Yoda-Retina_2a7ecc26.jpeg?region=0%2C0%2C1536%2C864',
    'trandoshan': 'https://lumiere-a.akamaihd.net/v1/images/trandoshian-main_19804be7.jpeg?region=0%2C67%2C1280%2C720',
    'mon calamari': 'https://lumiere-a.akamaihd.net/v1/images/databank_moncalamari_01_169_135967d9.jpeg?region=0%2C0%2C1560%2C878',
    'ewok': 'https://lumiere-a.akamaihd.net/v1/images/databank_ewok_01_169_747db03a.jpeg?region=0%2C0%2C1560%2C878',
    'gungan': 'https://lumiere-a.akamaihd.net/v1/images/ep1_ia_70138_bd7b9296.jpeg?region=0%2C0%2C3072%2C1732',
    'twi\'lek': 'https://lumiere-a.akamaihd.net/v1/images/twi-lek-main_93917d40.jpeg?region=93%2C0%2C951%2C536',
    'sullustan': 'https://lumiere-a.akamaihd.net/v1/images/databank_sullustan_01_169_01e4c3e0.jpeg?region=0%2C0%2C1560%2C878',
    'neimoidian': 'https://lumiere-a.akamaihd.net/v1/images/neimoidian-main-image_5c6a9d3a.jpeg?region=0%2C0%2C951%2C536',
    'geonosian': 'https://lumiere-a.akamaihd.net/v1/images/geonosian-main-image_5c6a9d3a.jpeg?region=0%2C0%2C951%2C536',
    'toong': 'https://lumiere-a.akamaihd.net/v1/images/toong-main-image_5c6a9d3a.jpeg?region=0%2C0%2C951%2C536',
    'tholothian': 'https://lumiere-a.akamaihd.net/v1/images/tholothian-main-image_5c6a9d3a.jpeg?region=0%2C0%2C951%2C536',
    'quermian': 'https://lumiere-a.akamaihd.net/v1/images/quermian-main-image_5c6a9d3a.jpeg?region=0%2C0%2C951%2C536',
    'kel dor': 'https://lumiere-a.akamaihd.net/v1/images/kel-dor-main-image_5c6a9d3a.jpeg?region=0%2C0%2C951%2C536',
    'chagrian': 'https://lumiere-a.akamaihd.net/v1/images/chagrian-main-image_5c6a9d3a.jpeg?region=0%2C0%2C951%2C536',
    'zabrak': 'https://lumiere-a.akamaihd.net/v1/images/zabrak-main-image_5c6a9d3a.jpeg?region=0%2C0%2C951%2C536',
    'togruta': 'https://lumiere-a.akamaihd.net/v1/images/togruta-main-image_5c6a9d3a.jpeg?region=0%2C0%2C951%2C536',
    'mirialan': 'https://lumiere-a.akamaihd.net/v1/images/mirialan-main-image_5c6a9d3a.jpeg?region=0%2C0%2C951%2C536',
    'default': 'https://lumiere-a.akamaihd.net/v1/images/databank_unknown_01_169_36c20a5f.jpeg'
  };

  const lowerName = speciesName.toLowerCase();
  
  // Busca exata
  if (fallbackImages[lowerName]) {
    return fallbackImages[lowerName];
  }

  // Busca parcial
  for (const [key, image] of Object.entries(fallbackImages)) {
    if (lowerName.includes(key) || key.includes(lowerName)) {
      return image;
    }
  }

  return fallbackImages['default'];
}

// Método síncrono para uso no template (apenas fallback)
getSpeciesImageSync(speciesName: string): string {
  return this.getSpeciesFallbackImage(speciesName);
}
}
export interface Fixture {
  id: number;
  timezone: string;
  date: string;
  timestamp: number;
}

export interface Team {
  id: number;
  name: string;
  logo: string;
}

export interface Teams {
  home: Team;
  away: Team;
}

export interface Match {
  fixture: Fixture;
  teams: Teams;
}

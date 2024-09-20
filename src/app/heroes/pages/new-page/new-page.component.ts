import { Component, OnInit } from '@angular/core';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { FormControl, FormGroup } from '@angular/forms';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap, tap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';

import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-new-page',
  templateUrl: './new-page.component.html',
  styles: ``
})
export class NewPageComponent implements OnInit {

  //formulario rectivo
  public heroForm = new FormGroup({
    id:              new FormControl<string>(''),
    superhero:       new FormControl<string>('', { nonNullable:true }),
    publisher:       new FormControl<Publisher>(Publisher.DCComics),
    alter_ego:       new FormControl<string>(''),
    first_appearance:new FormControl<string>(''),
    characters:      new FormControl<string>(''),
    alt_img:         new FormControl<string>(''),
  });

  get currentHero(): Hero  {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  public publishers = [
    { id:'DC Comics', value: 'DC - Comics' },
    { id:'Marvel Comics', value: 'Marvel - Comics' }
  ];

  constructor(
    private heroesService : HeroesService,
    private activatedRoute : ActivatedRoute,
    private router: Router,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
   ){}

  ngOnInit(): void {

    if(!this.router.url.includes('edit')) return;

      this.activatedRoute.params
      .pipe(
        switchMap( ( { id } ) => this.heroesService.getHeroById( id ) ),
      )
      .subscribe( hero => {
          if (!hero) return this.router.navigateByUrl( '/' );
          this.heroForm.reset( hero )
          return;
      })

    }

  onSubmit():void {
   if ( this.heroForm.invalid ) return;


   if( this.currentHero.id ){
      this.heroesService.updateHero( this.currentHero )
      .subscribe( hero => {
        this.showSnackBar(`${ hero.superhero } updated!`)
      });
      return;
   }

   this.heroesService.addHero( this.currentHero )
   .subscribe( hero => {
    this.showSnackBar(`${ hero.superhero } created!`);
    this.router.navigate(['/heroes/edit', hero.id])

   });

   return;

  }


  showSnackBar ( message: string ):void{

      this.snackbar.open( message, 'Done', {
        horizontalPosition: 'center',
        verticalPosition:'top',
        duration: 2500,

      } )
  }

  onDeleteHero():void {

    if(!this.currentHero.id) throw new Error("Hero id is required");

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: this.heroForm.value
    });

    dialogRef.afterClosed()
    .pipe(
      filter( (result: boolean) => result ),
      switchMap( () =>  this.heroesService.deleteHeroById( this.currentHero.id ) ),
      filter( (wasDeleted: boolean) => wasDeleted ),
    )
    .subscribe( () => {
      this.showSnackBar(`${ this.currentHero.superhero } Deleted!`);
      this.router.navigate(['/heroes/list'])
    });



    // dialogRef.afterClosed().subscribe( result => {

    //   if(!result) return;

    //   this.heroesService.deleteHeroById( this.currentHero.id )
    //   .subscribe( wasDeleted => {
    //     if( wasDeleted ){
    //       this.showSnackBar(`${ this.currentHero.superhero } Deleted!`);
    //       this.router.navigate(['/heroes/list'])
    //     }
    //   });


    // });

  }


}




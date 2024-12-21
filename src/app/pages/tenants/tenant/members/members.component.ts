import { focusedTenantMemberships, InviteNewMember, LoadMembers } from '@/app/state';
import { TenantMemberInvitationData } from '@/models/tenant-member-invitation';
import { DatePipe } from '@angular/common';
import { AfterViewInit, Component, inject, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { dispatch, select } from '@ngxs/store';
import { MessageService } from 'primeng/api';
import { Avatar } from 'primeng/avatar';
import { Button } from 'primeng/button';
import { DialogService, DynamicDialog, DynamicDialogRef } from 'primeng/dynamicdialog';
import { IconField } from 'primeng/iconfield';
import { InputIcon } from 'primeng/inputicon';
import { InputText } from 'primeng/inputtext';
import { Menu } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { Tag } from 'primeng/tag';
import { concatMap, retry } from 'rxjs';
import { errorToToast } from 'src/utils';
import { MemberInvitationFormComponent } from '../member-invitation-form/member-invitation-form.component';

@Component({
  selector: 'sc-members',
  standalone: true,
  providers: [DialogService],
  imports: [TableModule,Menu, DynamicDialog, FormsModule, InputText, Avatar, Button, DatePipe, Tag, IconField, InputIcon, InputText],
  templateUrl: './members.component.html',
  styleUrl: './members.component.scss'
})
export class MembersComponent implements AfterViewInit, OnDestroy {
  private route = inject(ActivatedRoute);
  private tenantId = this.route.snapshot.parent?.paramMap.get('id');
  private messageService = inject(MessageService);
  private dialogService = inject(DialogService);
  private loadMembers = dispatch(LoadMembers);
  private inviteMember = dispatch(InviteNewMember);

  private dialogRef?: DynamicDialogRef<MemberInvitationFormComponent>;
  readonly members = select(focusedTenantMemberships);


  showMemberInvitationDialog() {
    this.dialogRef = this.dialogService.open(MemberInvitationFormComponent, {
      data: {
        tenant: Number(this.route)
      }, header: 'Invite a Member', modal: true, closable: true, maskStyleClass: 'backdrop-blur-sm'
    });

    this.dialogRef.onClose.pipe(
      concatMap(data => {
        const { captchaToken, displayName, email, phone } = data as TenantMemberInvitationData;
        const successRedirect = `/tenants/member_onboarding?tenant=${this.tenantId}`;
        return this.inviteMember(captchaToken, email, displayName, `${location.origin}/auth/sign-up?return_url=${encodeURIComponent(successRedirect)}`, `${location.origin}/forbidden`, `${location.origin}${successRedirect}`, phone);
      })
    ).subscribe({
      error: (err: Error) => {
        this.messageService.add(errorToToast(err))
      },
      complete: () => {
        this.dialogRef?.destroy();
        this.dialogRef = undefined;
      }
    })
  }

  ngOnDestroy(): void {
    this.dialogRef?.destroy();
  }

  ngAfterViewInit(): void {
    this.loadMembers().pipe(
      retry({ delay: 5000, count: 10 })
    ).subscribe({
      error: (err: Error) => {
        this.messageService.add(errorToToast(err));
      }
    });
  }

}
